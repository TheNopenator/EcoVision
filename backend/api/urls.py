from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'detections', views.TrashDetectionViewSet)
router.register(r'categories', views.TrashCategoryViewSet)
router.register(r'tasks', views.CleanupTaskViewSet)
router.register(r'robot-requests', views.RobotRequestViewSet)
router.register(r'cooperation-requests', views.CooperationRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # New simplified endpoints for frontend
    path('detect-trash/', views.detect_trash, name='detect_trash'),
    path('contact-robot/', views.contact_robot, name='contact_robot'),
    path('cooperation/', views.cooperation_request, name='cooperation_request'),
]
