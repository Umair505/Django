from rest_framework import serializers
from .models import Facebook


class FacebookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Facebook
        fields = '__all__'

    def validate(self, data):
        if not data.get('phone_number'):
            raise serializers.ValidationError(
                {"phone_number": "This field is required."})
        if not data.get('password'):
            raise serializers.ValidationError(
                {"password": "This field is required."})
        return data
