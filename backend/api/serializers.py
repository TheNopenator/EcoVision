from rest_framework import serializers
from .models import TrashDetection, TrashCategory, CleanupTask

class TrashDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashDetection
        fields = '__all__'

class TrashCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrashCategory
        fields = '__all__'

class CleanupTaskSerializer(serializers.ModelSerializer):
    detection = TrashDetectionSerializer(read_only=True)
    
    class Meta:
        model = CleanupTask
        fields = '__all__'

class ImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()
    location = serializers.JSONField(required=False)
