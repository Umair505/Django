


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('account', views.UserAccountViewSet, basename='user-account')
router.register('allUser', views.AllUserViewSet)
router.register('is_users_staff', views.UserViewSet, basename='is_users_staff')
router.register('handle-staff', views.UserStaffViewSet, basename='handle-staff')
router.register('admin-messages', views.AdminMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.UserRegistrationSerializerViewSet.as_view(), name='register'),
    path('active/<uid64>/<token>/', views.activate, name='active'),  # Ensure this pattern matches your activation link
    path('login/', views.UserLoginApiView.as_view(), name='login'),
    path('logout/', views.UserLogoutApiView.as_view(), name='logout'),
    path('deposit/', views.DepositViewSet.as_view(), name='deposit'),
    path('successful-email-verified/', views.successful, name='verified_success'),
    path('unsuccessful-email-verified/', views.unsuccessful, name='verified_unsuccess'),
    path('update/', views.UserDetailView.as_view(), name='user-update'),
]
