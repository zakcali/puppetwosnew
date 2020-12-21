# puppetwosnew
Web of Science (New web site link: https://www.webofscience.com/wos/woscc/advanced-search ) advanced search by using puppeteer
Old (current link: https://apps.webofknowledge.com/WOS_AdvancedSearch_input.do?product=WOS&search_mode=AdvancedSearch ) web site can be accessed by my previous program: https://github.com/zakcali/puppetwos

# Introduction
Web of Science is an indexing service for quality scientific publications worldwide. If you have an ip access, usually in an university campus area, you can search for publications and citations online at their web site: http://apps.webofknowledge.com/
"Basic Search" option can be redirected from html forms, described and accessed here: http://wokinfo.com/webtools/searchbox/

Unfortunately, there isn't any form (at least I couldn't find) for "Advanced Search" option. You must go to, http://apps.webofknowledge.com/ click "Advanced Search" option, enter search terms, and click Search button.
If you don't search regulary, and know what to do this procedure is okay. But if you want to search for a lot of authors, or search for a lot of departments in an university, this is waste of time.  
Those links decribe, what how to use advanced search: http://images.webofknowledge.com/WOKRS534DR1/help/WOS/hp_advanced_search.html
and http://images.webofknowledge.com/WOKRS534DR1/help/WOS/hp_advanced_examples.html

# Downloaded files:
You must change let csvurl= 'http://xxx.yyy.edu/zzz/department-list.csv' and let csvurl= 'http://xxx.yyy.edu/zzz/author-list.csv' url's according to your preference in renderer.js

# Electron build
Nodejs code, uses Electron, and can be packaged as a standalone program.
Loads "advanced search query texts" from (url) author-list.csv and (url) department-list.csv files, creates lists for departments and academicians. When selected, a Chrome browser window opened by puppeteer, and displays the results from Web of Science. You must have access to the Web of Science site. 
