from django.urls import path
from .views import (CompanyListCreateView, 
                    CompanyRetrieveUpdateDestroyView, 
                    JobofferListCreateView, 
                    JobofferRetrieveUpdateDestroyView,
                    AdressListCreateView,
                    AdressRetrieveUpdateDestroyView,
                    CompanyUserView,
                    OffersCompanyView,
                    UpdateJobOffer,
                    JobsList,
                    CompanyAddressView,
                    JobofferCreateView,
                    ValiderJobOffer,
                    CompanyCreateView,
                    ValidOffersList,
                    NonValidOffersList,
                    TodayOffersList,
                    ThisweekOffersList,
                    ThismonthOffersList,
                    WilayaListView,
                    CommunesByWilayaView,
                    get_wilaya_commune_names
               #     ImportWilaya,
                #    ProductViewSet,
                  #  upload_file_view,
                    )

urlpatterns = [
    path('companies/', CompanyListCreateView.as_view(), name='company-list-create'),
    path('createcompany/', CompanyCreateView.as_view(), name='company-list-create'),
    path('company/<int:pk>/', CompanyUserView.as_view(), name='company-user'), #
    # path('company/', CompanyUserView.as_view(), name='company-user'), #
    path('company-adress-update/<int:pk>/', CompanyAddressView.as_view(), name='company-adress'),
    # path('update-company/<int:pk>/', CompanyUpdateView.as_view(), name='company-retrieve-update-destroy'), #
    path('joboffers/', JobofferListCreateView.as_view(), name='joboffer-list-create'),
    path('jobofferscreate/', JobofferCreateView.as_view(), name='joboffer-create'),
    path('companyoffers/', OffersCompanyView.as_view(), name='joboffer-list-company'),
    path('joboffer/<int:pk>/', JobofferRetrieveUpdateDestroyView.as_view(), name='joboffer-retrieve-update-destroy'),
    path('validerjoboffer/<int:pk>/', ValiderJobOffer.as_view(), name='joboffer-valider'),
    path('updatejoboffer/<int:pk>/', UpdateJobOffer.as_view(), name='joboffer-update'),
    path('addresses/', AdressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AdressRetrieveUpdateDestroyView.as_view(), name='address-retrieve-update-delete'),
    path('jobs/', JobsList.as_view(), name='jobsofuser'),
    path('validjobs/', ValidOffersList.as_view(), name='validjobs'),
    path('nonvalidjobs/', NonValidOffersList.as_view(), name='nonvalidjobs'),
    path('todayjobs/', TodayOffersList.as_view(), name='todayjobs'),
    path('thisweekjobs/', ThisweekOffersList.as_view(), name='weekjobs'),
    path('thismonthjobs/', ThismonthOffersList.as_view(), name='thismonthjobs'),
    path('wilayas/', WilayaListView.as_view(), name='wilaya-list'),
    path('communes-by_wilaya/<int:wilaya_id>/', CommunesByWilayaView.as_view(), name='communes-by-wilaya'),
    path('get-wilaya-commune-names/<int:wilaya_id>/<int:commune_id>/', get_wilaya_commune_names, name='get-wilaya-commune-names'),

]