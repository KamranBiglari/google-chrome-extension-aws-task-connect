
// jQuery document ready


function onWindowLoad() {
    var message = document.querySelector('body');

    

    chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
        
        var url = activeTab.url;
        var subStr = url.match("https:\/\/(?<region>.+)\.console\.aws\.amazon\.com\/.+\/clusters\/(?<cluster>.+)\/services\/(?<service>.+)\/tasks\/(?<taskid>.+)\/.+selectedContainer=(?<container>.+)");
        var Cluster = subStr.groups.cluster;
        var TaskId = subStr.groups.taskid;
        var Container = subStr.groups.container;
        var Region = subStr.groups.region;
        // message.innerText = `aws-task-connect ${Cluster} ${TaskId} ${Container}`;
        jQuery('#cluster').html(Cluster);
        jQuery('#taskid').html(TaskId);
        jQuery('#container').html(Container);
        jQuery('#region').html(Region);
        jQuery('#command').html(`aws-task-connect ${Cluster} ${TaskId} ${Container} ${Region}`);
        // alert(`aws-task-connect ${Cluster} ${TaskId} ${Container}`);
        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            // injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
            func: DOMtoString,
            // args: ['body']  // you can use this to target what element to get the html for
        });

    }).then(function (results) {
        
        // message.innerHTML = results[0].result;
        // console.log(jQuery('div:contains("arn")').html());
        // var html = jQuery.parseHTML(results[0].result);
        // var $data = jQuery('<output>').append(jQuery.parseHTML(results[0].result));
        // jQuery('div:contains("arn:aws:ecs:")',$data).each(function() {
        //     console.log(jQuery(this).text());
        // });
        
    }).catch(function (error) {
        message.innerText = 'There was an error injecting script : \n' + error.message;
    });
}

window.onload = onWindowLoad;

function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.outerHTML;
}