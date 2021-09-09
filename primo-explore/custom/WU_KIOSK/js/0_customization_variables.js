
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
  
// Librarian Chat: 

app.constant('libraryh3lpWidgetConfig', {
  url: 'https://libraryh3lp.com/chat/hat-help@chat.libraryh3lp.com',
  prompt: 'Chat with us',
  icon: {
    set: 'communication',
    icon: 'ic_chat_24px'
  }
});
