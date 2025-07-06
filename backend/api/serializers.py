from rest_framework import serializers
from .models import TrashDetection, TrashCategory, CleanupTask, RobotRequest, CooperationRequest

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

class RobotRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RobotRequest
        fields = '__all__'

class CooperationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CooperationRequest
        fields = '__all__'
