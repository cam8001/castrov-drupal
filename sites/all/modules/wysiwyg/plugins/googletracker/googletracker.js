/* 
 * Intellavia GoogleTracker Plugin © 2012
 * 
 * This plugin is free to use and modify as needed. Enjoy.
 * 
 * Author: Ryan Mills
 * Date:   03/27/2012
 */

function cleanText( input ) {
    var cleanText = input;
    
    cleanText = cleanText.replace(/'/g,"\\'");
    
    return cleanText;
}

CKEDITOR.plugins.add('googletracker',
{
    init: function(editor) {
        var pluginName = 'googletracker';
        var iconPath = CKEDITOR.plugins.getPath(pluginName) + '/images/googletracker.png';
        
        editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));
        // add the button to the ui
        editor.ui.addButton('GoogleTracker',
        {
            label: 'Google Event Tracking',
            command: pluginName,
            icon: iconPath
        });
        
        editor.on('selectionChange', function(evt) {
            if ( editor.readOnly ) return;
            
            var command = editor.getCommand(pluginName), 
                element = evt.data.path.lastElement && evt.data.path.lastElement.getAscendant('a', true);
                
            if( element && element.getName() == 'a' && element.getAttribute('href') && element.getChildCount() ) {
                command.setState( CKEDITOR.TRISTATE_OFF );  
            } else {
                command.setState( CKEDITOR.TRISTATE_DISABLED );
            }   
            
        });
        
        if ( editor.contextMenu )
        {
            editor.addMenuGroup('googleanalytics', 10);
            
            editor.addMenuItem('googleanalyticItem', {
                label: 'Google Event Tracking',
                icon: iconPath,
                command: pluginName,
                group: 'googleanalytics',
                order: 1
            });
            
            editor.contextMenu.addListener( function( element, selection ) {
                if ( !element ) 
                    return null;

                if ( element.is('a') )
                    return {googleanalyticItem: CKEDITOR.TRISTATE_OFF};


                return null;
            });
        }
        
        // add dialog
        CKEDITOR.dialog.add(pluginName, function(editor) {
            var anchorCateogry, anchorText, anchorLabel;
            
            return {
                title : "Add Google Event Tracker",
                minWidth : "400",
                minHeight : "220",
                contents: [
                {
                    id: 'tab1',
                    label: 'Settings',
                    elements: [
                    {
                        type: 'text',
                        id: 'category',
                        label: 'Category',
                        validate: CKEDITOR.dialog.validate.notEmpty("Category field cannot be empty"),
                        setup: function( element ) {                            
                            if(element[0]) {
                                this.setValue( element[0].trim() );
                            }
                        }, 
                        commit: function( element ) {
                            if(element.is('a')) {
                                element.removeAttribute('data-cke-pa-onclick');
                                element.setAttribute('onclick', "_gaq.push(['_trackEvent', '" + this.getValue() + "', '" + anchorText + "', '" + anchorLabel + "'])");
                            } else if(element.getParent().is('a')) {
                                element.getParent().removeAttribute('data-cke-pa-onclick');
                                element.getParent().setAttribute('onclick', "_gaq.push(['_trackEvent', '" + this.getValue() + "', '" + anchorText + "', '" + anchorLabel + "'])");
                            }
                        }
                    },
                    {
                        type: 'text',
                        id: 'action',
                        label: 'Action',
                        validate: CKEDITOR.dialog.validate.notEmpty("Action field cannot be empty"),
                        setup: function( element ) {
                            if(element[1]) {
                                this.setValue( element[1].trim() );
                            }
                        }, 
                        commit: function( element ) {
                            if(element.is('a')) {
                                element.removeAttribute('data-cke-pa-onclick');
                                element.setAttribute('onclick', "_gaq.push(['_trackEvent', '" + anchorCateogry + "', '" + anchorText + "', '" + anchorLabel + "'])");
                            } else if(element.getParent().is('a')) {
                                element.getParent().removeAttribute('data-cke-pa-onclick');
                                element.getParent().setAttribute('onclick', "_gaq.push(['_trackEvent', '" + anchorCateogry + "', '" + anchorText + "', '" + anchorLabel + "'])");
                            }
                        }
                    },
                    {
                        type: 'text',
                        id: 'label',
                        label: 'Label (Optional)',
                        setup: function( element ) {
                            if(element[2]) {
                                this.setValue( element[2].trim() );
                            }
                        }, 
                        commit: function( element ) {
                            if(element.is('a')) {
                                element.removeAttribute('data-cke-pa-onclick');
                                element.setAttribute('onclick', "_gaq.push(['_trackEvent', '" + anchorCateogry + "', '" + anchorText + "', '" + anchorLabel + "'])");
                            } else if(element.getParent().is('a')) {
                                element.getParent().removeAttribute('data-cke-pa-onclick');
                                element.getParent().setAttribute('onclick', "_gaq.push(['_trackEvent', '" + anchorCateogry + "', '" + anchorText + "', '" + anchorLabel + "'])");
                            }
                        }
                    }
                    ]
                }],
                onOk: function() {
                    var dialog = this;
                    var element = this.element;
                    
                    console.log(element);
                    console.log(dialog.getValueOf('tab1', 'category'));
                    console.log(dialog.getValueOf('tab1', 'action'));
                    console.log(dialog.getValueOf('tab1', 'label'));
                    
                    var category = cleanText(dialog.getValueOf('tab1', 'category'));
                    var text = cleanText(dialog.getValueOf('tab1', 'action'));
                    var label = cleanText(dialog.getValueOf('tab1', 'label'));
                    
                    anchorCateogry = category;
                    anchorText = text;
                    anchorLabel = label;
 
                    if(element.is('a')) {
                        element.removeAttribute('data-cke-pa-onclick');
                        element.setAttribute('onclick', "_gaq.push(['_trackEvent', '" + category + "', '" + text + "', '" + label + "'])");
                    } else if(element.getParent().is('a')) {
                        element.getParent().removeAttribute('data-cke-pa-onclick');
                        element.getParent().setAttribute('onclick', "_gaq.push(['_trackEvent', '" + category + "', '" + text + "', '" + label + "'])");
                    } else {
                        CKEDITOR.dialog.getCurrent().hide();
                        alert('Please select an anchor element'); 
                    }

                    this.commitContent(element);
                },
                onShow: function() {
                    var element = editor.getSelection().getStartElement();
                   
                    var temp = element.getAttribute('data-cke-pa-onclick');
                    console.log(element);
                    
                    this.element = element;
                    
                    if( temp = element.getAttribute('data-cke-pa-onclick') ) {
                        temp = temp.replace("_gaq.push([\'_trackEvent', ", "");
                        temp = temp.replace("])", '');
                        temp = temp.replace(/'/g, '');

                        var result = temp.split(',');
                        this.setupContent( result );    
                    } else if( temp = element.getParent().getAttribute('data-cke-pa-onclick') ) {
                        temp = temp.replace("_gaq.push([\'_trackEvent', ", "");
                        temp = temp.replace("])", '');
                        temp = temp.replace(/'/g, '');

                        var result = temp.split(',');
                        this.setupContent( result );  
                    }
                    
                    if(!element.is('a') && !element.getParent().is('a')) {
                        CKEDITOR.dialog.getCurrent().hide();
                        alert('Please select an anchor element'); 
                    }
                } 
            }
           
    
        });
        
    }
}
);
