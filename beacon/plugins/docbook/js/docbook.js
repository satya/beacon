/*
* Docbook Plugin for Beacon
*
* Copyright Satya Komaragiri and Beacon Team
* Licensed under GPLv3
*
*/

function docbook_dtd() {

    var common = {
      
      inlineChildren: [
      "docbookXref",
      "docbookEmphasis",
      "docbookSubscript",
      "docbookSuperscript",

      "docbookSGMLTag",
      "docbookFileName",
      "docbookCommand",
      "docbookOption",
      "docbookUserInput",
      "docbookComputerOutput",
      "docbookClassName",
      "docbookConstant",
      "docbookFunction",
      "docbookParameter",
      "docbookReplaceable",
      "docbookVarname",
      "docbookStructfield",
      "docbookSystemItem",
      "docbookPackage",
      "docbookPrompt"
      ],
               
      blockSiblings: [
      "docbookScreen", 
      "docbookItemizedList",
      "docbookOrderedList",
      "docbookProcedure",
      "docbookPara",
      "docbookTable",
      "docbookNote",
      "docbookWarning",
      "docbookImportant"
      ]
      
      
    };

    var dtd = {
        docbookArticle: {
            removable: false
        },

        docbookArticleTitle: {
            type: "block",
            editorType: "lineedit",
            removable: false
        },

        docbookSection: {
            type: "block",
            inlineChildren: false,
            blockChildren: ["docbookSectionTitle"],
            siblings: ["docbookSection"],
            markup: {
                requiredChildNodes: ["docbookSectionTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "section"
                }
            }
        },

        docbookSectionTitle: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: false,
                sampleText: "Sample Section"
            }
        },

        docbookAffiliation: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "Sample Affiliation"
            }
        },

        docbookStreet: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "Sample Street"
            }
        },

        docbookCity: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "Sample City"
            }
        },

        docbookState: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "Sample State"
            }
        },

        docbookPostcode: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "Sample Postcode"
            }
        },

        docbookPara: {
            type: "block",
            inlineChildren: common.inlineChildren,
            blockChildren: false,
            siblings: common.blockSiblings,
            editorType: "richText",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "This is a sample paragraph."
            }
        },

        docbookTable: {
            type: "block",
            siblings: common.blockSiblings,
            markup: {
                tag: "table",
                attributes: { tabstyle: "striped", frame:"all", cols: "3"},
                requiredChildNodes: ["docbookThead","docbookTbody"]
            }
        },
        
        docbookThead: {
            type: "block",
            markup: {
                tag: "thead",
                attributes: false,
                requiredChildNodes: ["docbookRow"]
            }
        },

        docbookTbody: {
            type: "block",
            markup: {
                tag: "tbody",
                attributes: false,
                requiredChildNodes: ["docbookRow","docbookRow"]
            }
        },
        
        docbookRow: {
            type: "block",
            markup: {
                tag: "tr",
                attributes: false,
                requiredChildNodes: ["docbookEntry","docbookEntry","docbookEntry"]
            }
        },

        docbookEntry: {
            type: "block",
            markup: {
                tag: "td",
                attributes: false,
                requiredChildNodes: ["docbookPara"]
            }
        },

        docbookItemizedList: {
            type: "block",
            siblings: common.blockSiblings,
            markup: {
                requiredChildNodes: ["docbookItemizedListContainer"],
                tag: "div",
                attributes: false
            }
        },

        docbookItemizedListTitle: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "itemizedlistitle"
                },
                sampleText: "Sample Itemized List"
            }
        },

        docbookItemizedListContainer: {
            type: "block",
            markup: {
                requiredChildNodes: ["docbookListItem"],
                tag: "ul",
                attributes: {
                    className: "itemizedList"
                }
            }
        },

        docbookOrderedList: {
            type: "block",
            siblings: common.blockSiblings,
            markup: {
                requiredChildNodes: ["docbookOrderedListContainer"],
                tag: "div",
                attributes: false
            }
        },

        docbookOrderedListTitle: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "orderedlistitle"
                },
                sampleText: "Sample Ordered List"
            }
        },

        docbookOrderedListContainer: {
            type: "block",
            markup: {
                requiredChildNodes: ["docbookListItem"],
                tag: "ol",
                attributes: {
                    className: "orderedList"
                }
            }
        },

        docbookListItem: {
            type: "block",
            siblings: ["docbookListItem"],
            markup: {
                requiredChildNodes: ["docbookPara"],
                tag: "li",
                attributes: false
            }
        },

        docbookProcedure: {
            type: "block",
            siblings: common.blockSiblings,
            markup: {
                requiredChildNodes: ["docbookProcedureTitle", "docbookProcedureContainer"],
                tag: "div",
                attributes: false
            }
        },

        docbookProcedureTitle: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "procedurelistitle"
                },
                sampleText: "Sample Procedure"
            }
        },

        docbookProcedureContainer: {
            type: "block",
            markup: {
                requiredChildNodes: ["docbookStep"],
                tag: "ol",
                attributes: {
                    className: "procedure"
                }
            }
        },

        docbookStep: {
            type: "block",
            siblings: ["docbookStep"],
            markup: {
                requiredChildNodes: ["docbookPara"],
                tag: "li",
                attributes: false
            }
        },

        docbookNote: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            siblings: common.blockSiblings,
            markup: {
                requiredChildNodes: ["docbookNoteTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "note"
                },
            }
        },

        docbookNoteTitle: {
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: {
                    className: "label"
                },
                sampleText: "Sample Note"
            }
        },

        docbookWarning: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            siblings: common.blockSiblings,
            markup: {
                requiredChildNodes: ["docbookWarningTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "warning"
                },
            }
        },

        docbookWarningTitle: {
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: {
                    className: "label"
                },
                sampleText: "Sample Warning"
            }
        },

        docbookImportant: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            siblings: common.blockSiblings,
            markup: {
                requiredChildNodes: ["docbookImportantTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "important"
                },
            }
        },

        docbookImportantTitle: {
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: {
                    className: "label"
                },
                sampleText: "Sample Important"
            }
        },

        docbookScreen: {
            type: "block",
            inlineChildren: common.inlineChildren,
            blockChildren: false,
            siblings: common.blockSiblings,
            editorType: "richText",
            markup: {
                tag: "pre",
                attributes: {
                    className: "screen"
                },
                sampleText: "This is a sample screen."
            }
        },


        // Inline Tags below this

        docbookXref: {
            type: "inline",
            inlineType: "prompt",
            markup: {
                tag: "a",
                attributes: {
                    className: "xref",
                    linkend: "prompt"
                }
            }
        },

        docbookSGMLTag: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "sgmltag-element"
                }
            }
        },

        docbookEmphasis: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "emphasis"
                }
            }
        },

        docbookFileName: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "filename"
                }
            }
        },

        docbookClassName: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "classname"
                }
            }
        },

        docbookConstant: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "constant"
                }
            }
        },

        docbookFunction: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "function"
                }
            }
        },

        docbookParameter: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "parameter"
                }
            }
        },

        docbookReplaceable: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "replaceable"
                }
            }
        },

        docbookVarname: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "varname"
                }
            }
        },

        docbookStructfield: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "structfield"
                }
            }
        },

        docbookSystemItem: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "systemitem"
                }
            }
        },

        docbookCommand: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "command",
                }
            }
        },

        docbookOption: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "option"
                }
            }
        },

        docbookUserInput: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "userinput",
                }
            }
        },

        docbookComputerOutput: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "computeroutput"
                }
            }
        },

        docbookPackage: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "package"
                }
            }
        },

        docbookSubscript: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "sub",
                attributes: false
            }
        },

        docbookSuperscript: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "sup",
                attributes: false
            }
        },

        docbookPrompt: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "prompt"
                }
            }
        },

    };

    return dtd;
};
