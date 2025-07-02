from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'detections', views.TrashDetectionViewSet)
router.register(r'categories', views.TrashCategoryViewSet)
router.register(r'tasks', views.CleanupTaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
