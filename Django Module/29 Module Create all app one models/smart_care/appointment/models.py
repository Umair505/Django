from django.db import models
from doctors.models import Doctor,AvailableTime
from patients.models import Patient


APPOINTMENT_STATUS=[
    ('Completed','Completed'),
    ('Pending','Pending'),
    ('Running','Running'),
]
APPOINTMENT_TYPE=[
    
    ('Online','Online'),
    ('Offline','Offline'),
]

class Appointment(models.Model):
    patient = models.ForeignKey(Patient,on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE)
    appointment_types = models.CharField(choices=APPOINTMENT_TYPE,max_length=20)
    appointment_status = models.CharField(choices=APPOINTMENT_STATUS,max_length=20,default='Pending')
    symptom = models.TextField()
    time=models.OneToOneField(AvailableTime,on_delete=models.CASCADE)
    cancel = models.BooleanField(default=False)
    
    def __str__(self):
        return f'Doctor : {self.doctor.user.first_name} , Patient : {self.patient.user.first_name}'
    