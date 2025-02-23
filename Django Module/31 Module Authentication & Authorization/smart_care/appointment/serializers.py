from rest_framework import serializers
from . import models

class AppointmentSerializer(serializers.ModelSerializer):
    # patient = serializers.StringRelatedField(many=False)
    # time = serializers.StringRelatedField(many=False)
    # doctor = serializers.StringRelatedField(many=False)

    class Meta:
        model = models.Appointment
        fields = '__all__'

    def validate(self, data):
        patient = data.get('patient')
        doctor = data.get('doctor')
        time = data.get('time')

        if models.Appointment.objects.filter(patient=patient, doctor=doctor, time=time).exists():
            raise serializers.ValidationError("This patient already has an appointment with this doctor at the same time.")
        
        return data
