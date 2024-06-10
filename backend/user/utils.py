from django.core.mail import EmailMessage
from django.core.mail import send_mail


import threading


class EmailThread(threading.Thread):

    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)

    def run(self):
        self.email.send()


class Util:
    @staticmethod
    def send_email(data):
        send_mail(
        data['email_subject'],
        data['email_body'],
        'lapemservice@gmail.com',
        [data['to_email']],
        fail_silently=False,
        )
        # email = EmailMessage(
        #     subject=data['email_subject'], body=data['email_body'], to=[data['to_email']])
        # EmailThread(email).start()