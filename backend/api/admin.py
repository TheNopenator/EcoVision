from django.contrib import admin
from .models import TrashDetection, TrashCategory, CleanupTask, RobotRequest, CooperationRequest

@admin.register(TrashDetection)
class TrashDetectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'detected_at', 'processed']
    list_filter = ['detected_at', 'processed']
    readonly_fields = ['detected_at']

@admin.register(TrashCategory)
class TrashCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color']

@admin.register(CleanupTask)
class CleanupTaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'assigned_to', 'created_at']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at']

@admin.register(RobotRequest)
class RobotRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'robot_id', 'status', 'request_time', 'eta_minutes']
    list_filter = ['status', 'request_time']
    readonly_fields = ['request_time']

@admin.register(CooperationRequest)
class CooperationRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    readonly_fields = ['created_at']
