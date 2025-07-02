from django.db import models
from django.utils import timezone

class TrashDetection(models.Model):
    image_url = models.URLField(max_length=500)
    detected_objects = models.JSONField(default=list)
    confidence_scores = models.JSONField(default=list)
    location = models.JSONField(default=dict)  # {"lat": 0.0, "lng": 0.0, "address": ""}
    detected_at = models.DateTimeField(default=timezone.now)
    processed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-detected_at']
    
    def __str__(self):
        return f"Detection at {self.detected_at}"

class TrashCategory(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default="#FF0000")  # Hex color for UI
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Trash Categories"

class CleanupTask(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    detection = models.ForeignKey(TrashDetection, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"Task for detection {self.detection.id} - {self.status}"
