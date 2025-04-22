
from .serializers import UserDetailSerializer
from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import viewsets,permissions
from . models import UserAccount,AdminMessage
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.contrib.auth import authenticate, login, logout
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from rest_framework import generics
from .permissions import IsAdminOrReadOnly 
from rest_framework import viewsets
from . serializers import UserAccountSerializer, UserRegistrationSerializer, UserLoginSerializer, AllUserSerializer, DepositSerializer,UserSerializer,AdminMessageSerializer,UserStaffSerializer
from rest_framework.permissions import IsAdminUser


class AllUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = AllUserSerializer
    permission_classes=[IsAdminOrReadOnly]


class UserAccountViewSet(viewsets.ModelViewSet):
    queryset = UserAccount.objects.all()
    serializer_class = UserAccountSerializer
    permission_classes=[IsAdminOrReadOnly]
    


class UserRegistrationSerializerViewSet(APIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            print(user)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            confirm_link = f"https://hotel-booking-website-backend.vercel.app/user/active/{uid}/{token}/"
            email_subject = "Confirm Your Email"
            email_body = render_to_string(
                'confirm_email.html', {'confirm_link': confirm_link})

            email = EmailMultiAlternatives(email_subject, '', to=[user.email])
            email.attach_alternative(email_body, "text/html")

            email.send()

            return Response('Check your email for confirmation')
        return Response(serializer.errors)


User = get_user_model()


def activate(request, uid64, token):
    try:
        uid = urlsafe_base64_decode(uid64).decode()
    except (TypeError, ValueError, UnicodeDecodeError):
        return redirect('verified_unsuccess')

    user = get_object_or_404(User, pk=uid)

    if default_token_generator.check_token(user, token):
        if not user.is_active:
            user.is_active = True
            user.save()
        return redirect('verified_success')
    else:
        return redirect('verified_unsuccess')




class UserLoginApiView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=self.request.data)

        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(username=username, password=password)

            if user:
                login(request, user)
                token, _ = Token.objects.get_or_create(user=user)
                
                # Add the is_staff field to the response
                return Response({
                    'token': token.key,
                    'user_id': user.id,
                    'is_staff': user.is_staff, 
                })
            else:
                return Response({'error': 'Invalid Credentials'}, status=400)
        return Response(serializer.errors, status=400)


class UserLogoutApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.auth_token:
            request.user.auth_token.delete()
        logout(request)
        return redirect('login')




class DepositViewSet(APIView):
    def post(self, request):
        serializer = DepositSerializer(data=request.data)
        if serializer.is_valid():
            transaction = serializer.save()
            response_data = {
                'message' : 'Deposit successful',
                'transaction_id' : transaction.id
            }
            
            return Response(response_data)
        else:
            return Response(serializer.errors)
        



class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user



class AdminMessageViewSet(viewsets.ModelViewSet):
    queryset= AdminMessage.objects.all()
    serializer_class = AdminMessageSerializer
    permission_classes=[permissions.IsAdminUser]
    
    def get_queryset(self):
        user= self.request.user
        if user.is_staff or user.is_superuser:
            return AdminMessage.objects.all()
        return AdminMessage.objects.filter(user=user)
    

    
#only change staff permission
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes=[IsAdminOrReadOnly]
    




from rest_framework.pagination import PageNumberPagination

class CustomPagination(PageNumberPagination):
    page_size = 6  
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class UserStaffViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserStaffSerializer
    permission_classes = [IsAdminUser]
    pagination_class = CustomPagination 

