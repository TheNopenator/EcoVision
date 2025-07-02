from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
import os
import json

from .models import TrashDetection, TrashCategory, CleanupTask
from .serializers import (
    TrashDetectionSerializer, 
    TrashCategorySerializer, 
    CleanupTaskSerializer,
    ImageUploadSerializer
)
from .cv_model import trash_detector

class TrashDetectionViewSet(viewsets.ModelViewSet):
    queryset = TrashDetection.objects.all()
    serializer_class = TrashDetectionSerializer
    
    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_and_detect(self, request):
        """Upload image and detect trash"""
        serializer = ImageUploadSerializer(data=request.data)
        
        if serializer.is_valid():
            image = serializer.validated_data['image']
            location = serializer.validated_data.get('location', {})
            
            # Save uploaded image
            image_name = f"uploads/{timezone.now().strftime('%Y%m%d_%H%M%S')}_{image.name}"
            image_path = default_storage.save(image_name, ContentFile(image.read()))
            full_image_path = default_storage.path(image_path)
            
            try:
                # Detect trash in the image
                detections = trash_detector.detect_trash(full_image_path)
                
                # Extract detected objects and confidence scores
                detected_objects = [det['class'] for det in detections]
                confidence_scores = [det['confidence'] for det in detections]
                
                # Create detection record
                detection = TrashDetection.objects.create(
                    image_url=default_storage.url(image_path),
                    detected_objects=detected_objects,
                    confidence_scores=confidence_scores,
                    location=location
                )
                
                # Create cleanup task if trash is detected
                if detected_objects:
                    CleanupTask.objects.create(
                        detection=detection,
                        status='pending'
                    )
                
                # Return detection results with bounding boxes
                return Response({
                    'detection_id': detection.id,
                    'image_url': detection.image_url,
                    'detections': detections,
                    'detected_objects': detected_objects,
                    'confidence_scores': confidence_scores,
                    'location': location,
                    'detected_at': detection.detected_at
                }, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response({
                    'error': f'Error processing image: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def recent_detections(self, request):
        """Get recent trash detections"""
        recent = self.queryset.filter(
            detected_at__gte=timezone.now() - timezone.timedelta(days=7)
        )[:20]
        serializer = self.get_serializer(recent, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get detection statistics"""
        total_detections = self.queryset.count()
        today_detections = self.queryset.filter(
            detected_at__date=timezone.now().date()
        ).count()
        
        # Count by trash type
        trash_counts = {}
        for detection in self.queryset.all():
            for obj in detection.detected_objects:
                trash_counts[obj] = trash_counts.get(obj, 0) + 1
        
        return Response({
            'total_detections': total_detections,
            'today_detections': today_detections,
            'trash_counts': trash_counts
        })

class TrashCategoryViewSet(viewsets.ModelViewSet):
    queryset = TrashCategory.objects.all()
    serializer_class = TrashCategorySerializer

class CleanupTaskViewSet(viewsets.ModelViewSet):
    queryset = CleanupTask.objects.all()
    serializer_class = CleanupTaskSerializer
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update task status"""
        task = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in ['pending', 'assigned', 'in_progress', 'completed']:
            task.status = new_status
            if new_status == 'completed':
                task.completed_at = timezone.now()
            task.save()
            
            serializer = self.get_serializer(task)
            return Response(serializer.data)
        
        return Response({
            'error': 'Invalid status'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def pending_tasks(self, request):
        """Get pending cleanup tasks"""
        pending = self.queryset.filter(status='pending')
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)
