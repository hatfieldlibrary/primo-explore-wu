
/************************************* BEGIN Customization Variables ************************************/

/*
 * Here you can enter options to be passed to customization packages to configure them.
 */

// Report a Problem:

app.constant('reportProblemOptions', {
    message: "See something that doesn't look right?",
    button: "Report a Problem",
    base: "https://library.willamette.edu/external/exlibris/primonew/reportproblem/index.php?"
  });
  
  app.constant('smsActionOptions', {
    label: "Text Call Number",
    index: 0,
    icon: {
      icon: 'ic_textsms_24px',
      iconSet: 'communication',
      type: 'svg'
    },
    libraries: 'HAT: Hatfield Library, LAW: Law Library'
});

  // Librarian chat:

app.constant('libraryh3lpWidgetConfig', {
  url: 'https://libraryh3lp.com/chat/hat-help@chat.libraryh3lp.com',
  prompt: 'Chat with Librarian',
  icon: {
    set: 'communication',
    icon: 'ic_chat_24px'
  }
});

// Hide institutions:

app.constant('showHideMoreInstOptions', {
  default_state: "hidden",
  show_label: "Show libraries",
  hide_label: "Hide libraries"
});

// oadoi-links:
app.constant('oadoiOptions', {
  "imagePath": "custom/WU/img/oa_50.png",
  "email": "library@willamette.edu"
})

// My ILL
app.constant('illiadOptions', {
  "groups": ["CLAFACULTY", "CLASTUDENT", "ATKFACULTY", "ADMIN", "LIBRARY", "EXTDCHECK", "EMERITUS", "ATKSTUDENT", "TIUAFACULTY", "ATKPORTLAND", "WUSTAFF", "LIBSTAFF", "CSTSTUDENT", "CSTFACULTY", "CSTSTAFF"],
  "remoteScript": "https://library.willamette.edu/scripts/my-ill/illiad.php",
  "boxTitle": "Hatfield Interlibrary Loan",
  "illiadURL": "https://illiad.willamette.edu/illiad/illiad.dll?Action=10&Form=10",
  "apiURL": "https://illiad.willamette.edu/ILLiadWebPlatform/Transaction/UserRequests/",


})

