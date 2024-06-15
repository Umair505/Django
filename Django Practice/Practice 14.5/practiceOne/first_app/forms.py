from django import forms
from django.forms.widgets import NumberInput
BIRTH_YEAR_CHOICES = ['1999', '2000', '2001','2002','2003']
Favourite_Player_CHOICES = [
    ('messi','Messi'),
    ('ronaldo','Ronaldo'),
    ('ozil','Ozil'),
]
class contactForm(forms.Form):
    name = forms.CharField(label="User Name")
    email = forms.EmailField(label="User Email")
    age = forms.IntegerField(label="Please Enter Your Age")
    weight = forms.FloatField()
    balance = forms.DecimalField()
    check = forms.BooleanField()
    # birthday = forms.DateField(label="What's Your BirthDate?")
    comment = forms.CharField(widget=forms.Textarea(attrs={'rows':3}))
    birth_date = forms.DateField(widget=NumberInput(attrs={'type': 'date'}))
    birth_year = forms.DateField(widget=forms.SelectDateWidget(years=BIRTH_YEAR_CHOICES))
    favourite_player = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple,choices=Favourite_Player_CHOICES)
    CHOICES = [
        ('s','Small'),
        ('m','Medium'),
        ('l','Large'),
    ]
    size = forms.ChoiceField(choices=CHOICES)
    file = forms.FileField()