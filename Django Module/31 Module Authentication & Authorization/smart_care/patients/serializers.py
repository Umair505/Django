
from rest_framework import serializers
from.import models
from django.contrib.auth.models import User

class PatientSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False)
    class Meta:
        model = models.Patient
        fields = '__all__'
        
class RegistrationsSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(required = True)
    class Meta :
        model = models.User
        fields = ['username','first_name','last_name','email','password','confirm_password']
        
    def save(self):
        username = self.validated_data['username']
        first_name = self.validated_data['first_name']
        last_name = self.validated_data['last_name']
        email = self.validated_data['email']
        password = self.validated_data['password']
        confirm_password = self.validated_data['confirm_password']

        if password != confirm_password:
            raise serializers.ValidationError({'error':"Password doesn't matched"})
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'error':"Email already exists"})
        account = User(username=username, email=email,first_name = first_name, last_name = last_name)
        print(account)
        account.set_password(password)
        account.is_active=False
        account.save()
        return account
    
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    
    