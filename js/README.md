# Willamette's Custom Javacript Files for Primo

This directory contains the various javascript files we use with our instance of the Primo New UI.

## 7_gift_book.js

Until we can get the Gift Book link in Primo to get populated properly from Alma, we have created the following work around. We hide the current bookplate element with CSS.

```
/* bookplate hide */
.bookplate {
    display: none;
}
```

Then we take the presence of a Gift Book in the lds06 field, and create a link to search for all gift books from that donor. You can seen an example here: https://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?displayMode=full&bulkSize=10&dum=true&highlight=true&displayField=all&vid=WU&institution=WU&scp.scps=scope:(WU)&search_scope=WU_Libraries_Summit&amp;&query=any,contains,Gift%20of%20Robert 

### Prerequisites

You will just want to customize the donor institution code, so for Willamette we only want gifts dontated to Willamette "$$IWU". And also make sure the lds06 has your "gift text", otherwise you will get all electronic links.

```
if (vm.donor.includes("$$IWU") && vm.donor.includes("Gift of") ) {

```

You will also want to customize the URL to search your Primo instance.


```
            vm.url = "http://alliance-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + vm.donor_chop + "&tab=default_tab&search_scope=WU_Libraries_Summit&sortby=rank&vid=WU&mode=advanced&offset=0";    


```

### Installing

You should be able to just drop it in your custom/js folder, update the code above, update your CSS and your PNX records must have a lds06 gift field.

## Acknowledgments

* Kudos to Corinna Baksik, whose presentation and sharing of code insipred the gift_book script.

