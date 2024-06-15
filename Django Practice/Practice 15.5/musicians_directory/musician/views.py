from django.shortcuts import render, redirect
from .models import Musician
from .forms import MusicianForm

def musician_list(request):
    musicians = Musician.objects.all()
    return render(request, 'musician_list.html', {'musicians': musicians})

def musician_create(request):
    if request.method == 'POST':
        form = MusicianForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('musician_list')
    else:
        form = MusicianForm()
    return render(request, 'musician_form.html', {'form': form})

def musician_edit(request, pk):
    musician = Musician.objects.get(pk=pk)
    if request.method == 'POST':
        form = MusicianForm(request.POST, instance=musician)
        if form.is_valid():
            form.save()
            return redirect('musician_list')
    else:
        form = MusicianForm(instance=musician)
    return render(request, 'musician_form.html', {'form': form})

def musician_delete(request, pk):
    musician = Musician.objects.get(pk=pk)
    musician.delete()
    return redirect('musician_list')
