from django.shortcuts import render

# Create your views here.
from django.conf import settings
from django.views.generic import TemplateView
from django.shortcuts import render
from django.http import HttpResponse
import os
import fnmatch


class cctv(TemplateView):
    template_name = 'test/cctv.html'


def display_video(request, vid=None):
    if vid is None:
        return HttpResponse("No Video")

    # Finding the name of video file with extension, use this if you have different extension of the videos
    video_name = ""
    for fname in os.listdir(settings.MEDIA_ROOT):
        if fnmatch.fnmatch(fname, vid + ".mp4"):  # using pattern to find the video file with given id and any extension
            video_name = fname
            break

    '''
        If you have all the videos of same extension e.g. mp4, then instead of above code, you can just use -

        video_name = vid+".mp4"

    '''

    # getting full url -
    video_url = settings.MEDIA_URL + video_name

    return render(request, "cctv.html", {"url": video_url})
