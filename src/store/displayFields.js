export default {
  'organisations': [
    {
      displayName: 'Name',
      children: [
        {
          displayName: 'Original',
          field: 'Organisation_Full_Name_Original'
        },
        {
          displayName: 'Legal',
          field: 'Legal_Full_Name'
        },
        {
          displayName: 'Cleaned for Match',
          field: 'Organisation_Full_Name',
          isHidden: true
        },
        {
          displayName: 'Previous',
          field: 'Organisation_Previous_Full_Name'
        },
        {
          displayName: 'Local',
          field: 'Organisation_Full_Name_Local'
        },
        {
          displayName: 'Trading As',
          field: 'Trading_As'
        }
      ]
    },
    {
      displayName: 'Address',
      children: [
        {
          displayName: 'Registered',
          field: [
            'Registered_Full_Address',
            'Registered_Town',
            'Registered_County',
            'Registered_Post_Code',
            'Registered_Country_Name',
            'Registered_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        },
        {
          displayName: 'Operating',
          field: [
            'Operating_Full_Address',
            'Operating_Town',
            'Operating_County',
            'Operating_Post_Code',
            'Operating_Country_Name',
            'Operating_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        },
        {
          displayName: 'Domicile',
          field: [
            'Domicile_Full_Address',
            'Domicile_Town',
            'Domicile_County',
            'Domicile_Post_Code',
            'Domicile_Country_Name',
            'Domicile_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists',
          isHidden: true
        },
        {
          displayName: 'Mailing',
          field: [
            'Mailing_Full_Address',
            'Mailing_Town',
            'Mailing_County',
            'Mailing_Post_Code',
            'Mailing_Country_Name',
            'Mailing_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        }
      ]
    },
    {
      displayName: 'Industry Sector Codes',
      field: 'SIC87_US_1',
      isHidden: true
    },
    {
      displayName: 'Entity Type',
      field: 'Entity_Level'
    },
    {
      displayName: 'Entity Status',
      field: 'Entity_Status'
    },
    {
      displayName: 'Organisation Type',
      field: 'Organisation_Type_Name'
    },
    {
      displayName: 'Global Head Office',
      field: 'Is_Head_Office_Global',
      isHidden: true
    },
    {
      displayName: 'Head Office',
      field: 'Is_Head_Office_Local',
      isHidden: true
    },
    {
      displayName: 'Issuer',
      field: 'Is_Issuer',
      isHidden: true
    },
    {
      displayName: 'Out of Business',
      field: 'Is_OOB',
      isHidden: true
    }
  ],
  'people': [
    {
      displayName: 'Name',
      field: 'Full_Name'
    },
    {
      displayName: 'DOB',
      field: 'DOB',
      cellFilter: 'formatDate'
    },
    {
      displayName: 'Home Address',
      field: [
        'Home_Full_Address',
        'Home_Town',
        'Home_County',
        'Home_Post_Code',
        'Home_Country_Name',
        'Home_Country_ISO_Code'
      ],
      cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
    },
    {
      displayName: 'Business Address',
      field: [
        'Business_Full_Address',
        'Business_Town',
        'Business_County',
        'Business_Post_Code',
        'Business_Country_Name',
        'Business_Country_ISO_Code'
      ],
      cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
    },
    {
      displayName: 'Mailing Address',
      field: [
        'Mailing_Full_Address',
        'Mailing_Town',
        'Mailing_County',
        'Mailing_Post_Code',
        'Mailing_Country_Name',
        'Mailing_Country_ISO_Code'
      ],
      cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
    },
    {
      displayName: 'Job Title',
      field: 'Job_Title'
    }
  ],
  instruments: [
    {
      displayName: 'Instrument Name',
      field: 'Instrument_Name'
    },
    {
      displayName: 'Issuer Name',
      field: 'Organisation_Full_Name'
    },
    {
      displayName: 'ISIN Code',
      field: 'ISIN_Code'
    },
    {
      displayName: 'Ticker Symbol',
      field: 'Ticker_Symbol'
    },
    {
      displayName: 'Exchange Name',
      field: 'Exchange_Name'
    },
    {
      displayName: 'Country ISO Code',
      field: 'Country_ISO_Code'
    }
  ],
  addresses: [
    {
      displayName: 'Country Name',
      field: 'Country_Name'
    },
    {
      displayName: 'Full Address',
      field: 'Full_Address'
    },
    {
      displayName: 'Post Code',
      field: 'Post_Code'
    },
    {
      displayName: 'Street Start Number',
      field: 'Street_Start_Number'
    },
    {
      displayName: 'Street Name',
      field: 'Street_Name'
    },
    {
      displayName: 'State Name',
      field: 'State_Name'
    },
    {
      displayName: 'Town Name',
      field: 'Town_Name'
    },
    {
      displayName: 'Country ISO Code',
      field: 'Country_ISO_Code'
    }
  ],
  'listed_organisations': [
    {
      displayName: 'Name',
      children: [
        {
          displayName: 'Name',
          field: 'Organisation_Full_Name'
        },
        {
          displayName: 'Legal',
          field: 'Legal_Full_Name'
        },
        {
          displayName: 'Local',
          field: 'Organisation_Full_Name_Local'
        },
        {
          displayName: 'Alias',
          field: 'Alias'
        }
      ]
    },
    {
      displayName: 'Address',
      children: [
        {
          displayName: 'Registered',
          field: [
            'Registered_Full_Address',
            'Registered_Town',
            'Registered_County',
            'Registered_Post_Code',
            'Registered_Country_Name',
            'Registered_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        },
        {
          displayName: 'Operating',
          field: [
            'Operating_Full_Address',
            'Operating_Town',
            'Operating_County',
            'Operating_Post_Code',
            'Operating_Country_Name',
            'Operating_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        }
      ]
    },
    {
      displayName: 'Sanction',
      children: [
        {
          displayName: 'List Name',
          field: 'List_Name'
        },
        {
          displayName: 'List Type',
          field: 'List_Type'
        },
        {
          displayName: 'Sanction Jurisdiction',
          field: 'Sanction_Jurisdiction'
        },
        {
          displayName: 'Is PEP',
          field: 'Is_PEP'
        }
      ]
    }
  ],
  'listed_people': [
    {
      displayName: 'Name',
      children: [
        {
          displayName: 'Name',
          field: 'Full_Name'
        },
        {
          displayName: 'Local',
          field: 'Full_Name_Local'
        },
        {
          displayName: 'Alias',
          field: 'Alias'
        }
      ]
    },
    {
      displayName: 'DOB',
      field: 'DOB',
      cellFilter: 'formatDate'
    },
    {
      displayName: 'Business Address',
      field: [
        'Business_Full_Address',
        'Business_Town',
        'Business_County',
        'Business_Post_Code',
        'Business_Country_Name',
        'Business_Country_ISO_Code'
      ],
      cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
    },
    {
      displayName: 'Job Title',
      field: 'Job_Title'
    },
    {
      displayName: 'Sanction',
      children: [
        {
          displayName: 'List Name',
          field: 'List_Name'
        },
        {
          displayName: 'List Type',
          field: 'List_Type'
        },
        {
          displayName: 'Sanction Jurisdiction',
          field: 'Sanction_Jurisdiction'
        },
        {
          displayName: 'Is PEP',
          field: 'Is_PEP'
        }
      ]
    }
  ],
  'listed_objects': [
    {
      displayName: 'Name',
      children: [
        {
          displayName: 'Name',
          field: 'Object_Full_Name_Original'
        },
        {
          displayName: 'Local',
          field: 'Object_Full_Name_Local'
        },
        {
          displayName: 'Alias',
          field: 'Alias'
        }
      ]
    },
    {
      displayName: 'Address',
      children: [
        {
          displayName: 'Registered',
          field: [
            'Registered_Full_Address',
            'Registered_Town',
            'Registered_County',
            'Registered_Post_Code',
            'Registered_Country_Name',
            'Registered_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        },
        {
          displayName: 'Operating',
          field: [
            'Operating_Full_Address',
            'Operating_Town',
            'Operating_County',
            'Operating_Post_Code',
            'Operating_Country_Name',
            'Operating_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        }
      ]
    },
    {
      displayName: 'Identifiers',
      children: [
        {
          displayName: 'IMO ID',
          field: 'IMO_ID'
        },
        {
          displayName: 'Ship Type',
          field: 'Ship_Type'
        },
        {
          displayName: 'MSN ID',
          field: 'MSN_ID'
        },
        {
          displayName: 'Plane Model',
          field: 'Plane_Model'
        }
      ]
    },
    {
      displayName: 'Sanction',
      children: [
        {
          displayName: 'List Name',
          field: 'List_Name'
        },
        {
          displayName: 'List Type',
          field: 'List_Type'
        },
        {
          displayName: 'Sanction Jurisdiction',
          field: 'Sanction_Jurisdiction'
        },
        {
          displayName: 'Is PEP',
          field: 'Is_PEP'
        }
      ]
    }
  ],
  'listed_locations': [
    {
      displayName: 'Name',
      children: [
        {
          displayName: 'Name',
          field: 'Location_Full_Name'
        },
        {
          displayName: 'Local',
          field: 'Location_Full_Name_Local'
        },
        {
          displayName: 'Alias',
          field: 'Alias'
        }
      ]
    },
    {
      displayName: 'Address',
      children: [
        {
          displayName: 'Registered',
          field: [
            'Registered_Full_Address',
            'Registered_Town',
            'Registered_County',
            'Registered_Post_Code',
            'Registered_Country_Name',
            'Registered_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        },
        {
          displayName: 'Operating',
          field: [
            'Operating_Full_Address',
            'Operating_Town',
            'Operating_County',
            'Operating_Post_Code',
            'Operating_Country_Name',
            'Operating_Country_ISO_Code'
          ],
          cellFilter: 'removeCountryIsoCodeIfCountryNameExists'
        }
      ]
    },
    {
      displayName: 'Identifiers',
      children: [
        {
          displayName: 'IATA Number',
          field: 'IATA_Number'
        },
        {
          displayName: 'IACO Code',
          field: 'ICAO_Code'
        },
        {
          displayName: 'Location Code',
          field: 'Location_Code'
        }
      ]
    },
    {
      displayName: 'Sanction',
      children: [
        {
          displayName: 'List Name',
          field: 'List_Name'
        },
        {
          displayName: 'List Type',
          field: 'List_Type'
        },
        {
          displayName: 'Sanction Jurisdiction',
          field: 'Sanction_Jurisdiction'
        },
        {
          displayName: 'Is PEP',
          field: 'Is_PEP'
        }
      ]
    }
  ]
}
