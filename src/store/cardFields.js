export default {
  organisations: {
    name: [
      {
        displayName: 'Name Cleaned for Match',
        field: 'Organisation_Full_Name'
      },
      {
        displayName: 'Name - Original',
        field: 'Organisation_Full_Name_Original'
      },
      {
        displayName: 'Name - Legal',
        field: 'Legal_Full_Name'
      },
      {
        displayName: 'Name - Previous',
        field: 'Organisation_Previous_Full_Name'
      },
      {
        displayName: 'Name - Local',
        field: 'Organisation_Full_Name_Local'
      },
      {
        displayName: 'Name - Trading As',
        field: 'Trading_As'
      }
    ],
    address: [
      {
        displayName: 'Registered Address',
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
        displayName: 'Operating Address',
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
        displayName: 'Domicile Address',
        field: [
          'Domicile_Full_Address',
          'Domicile_Town',
          'Domicile_County',
          'Domicile_Post_Code',
          'Domicile_Country_Name',
          'Domicile_Country_ISO_Code'
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
      }
    ],
    meta: [
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
        cellFilter: 'returnLabelIfValueEqualsYes'
      },
      {
        displayName: 'Head Office',
        field: 'Is_Head_Office_Local',
        cellFilter: 'returnLabelIfValueEqualsYes'
      },
      {
        displayName: 'Issuer',
        field: 'Is_Issuer',
        cellFilter: 'returnLabelIfValueEqualsYes'
      },
      {
        displayName: 'Out of Business',
        field: 'Is_OOB',
        cellFilter: 'returnLabelIfValueEqualsYes'
      }
    ]
  },
  people: {
    name: [
      {
        displayName: 'Name',
        field: 'Full_Name'
      }
    ],
    address: [
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
      }
    ],
    meta: [
      {
        displayName: 'DOB',
        field: 'DOB',
        cellFilter: 'formatDate'
      },
      {
        displayName: 'Job Title',
        field: 'Job_Title'
      }
    ]
  },
  instruments: {
    name: [
      {
        displayName: 'Instrument Name',
        field: 'Instrument_Name'
      }
    ],
    meta: [
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
    ]
  },
  listed_organisations: {
    name: [
      {
        displayName: 'Name',
        field: 'Organisation_Full_Name'
      },
      {
        displayName: 'Name - Legal',
        field: 'Legal_Full_Name'
      },
      {
        displayName: 'Name - Local',
        field: 'Organisation_Full_Name_Local'
      },
      {
        displayName: 'Name - Alias',
        field: 'Alias'
      }
    ],
    address: [
      {
        displayName: 'Registered Address',
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
        displayName: 'Operating Address',
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
    ],
    meta: [
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
        field: 'Is_PEP',
        cellFilter: 'returnLabelIfValueEqualsYes'
      }
    ]
  },
  listed_people: {
    name: [
      {
        displayName: 'Name',
        field: 'Full_Name'
      },
      {
        displayName: 'Name - Local',
        field: 'Full_Name_Local'
      },
      {
        displayName: 'Name - Alias',
        field: 'Alias'
      }
    ],
    address: [
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
      }
    ],
    meta: [
      {
        displayName: 'DOB',
        field: 'DOB',
        cellFilter: 'formatDate'
      },
      {
        displayName: 'Job Title',
        field: 'Job_Title'
      },
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
        field: 'Is_PEP',
        cellFilter: 'returnLabelIfValueEqualsYes'
      }
    ]
  },
  listed_objects: {
    name: [
      {
        displayName: 'Name',
        field: 'Object_Full_Name_Original'
      },
      {
        displayName: 'Name - Local',
        field: 'Object_Full_Name_Local'
      },
      {
        displayName: 'Name - Alias',
        field: 'Alias'
      }
    ],
    address: [
      {
        displayName: 'Registered Address',
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
        displayName: 'Operating Address',
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
    ],
    meta: [
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
        field: 'Is_PEP',
        cellFilter: 'returnLabelIfValueEqualsYes'
      }
    ]
  },
  listed_locations: {
    name: [
      {
        displayName: 'Name',
        field: 'Location_Full_Name'
      },
      {
        displayName: 'Name - Local',
        field: 'Location_Full_Name_Local'
      },
      {
        displayName: 'Name - Alias',
        field: 'Alias'
      }
    ],
    address: [
      {
        displayName: 'Registered Address',
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
        displayName: 'Operating Address',
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
    ],
    meta: [
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
        field: 'Is_PEP',
        cellFilter: 'returnLabelIfValueEqualsYes'
      }
    ]
  }
}
