'use client';
//tell nextjs to include this file to the javascript bundle
//if this component is dependent on other components, they will aitomatically become client component

import React, { useState, useEffect, useRef} from 'react';
import styles from "./SavedTemplate.module.css";
import MockData from 'src/sections/edit-template/templateData.json';
import ReactMarkdown from 'react-markdown';
import { Box, Stack, Typography, Button} from '@mui/material';

function Header({updateParentTitle, header, style}: any){

  const [description, setDescription] = useState('Add content...');
  const [title, setTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [name, setName]=useState<any>();
  const [sheetType, setSheetType] = useState(style);
  const handleEdit = () => {
      setEditMode(true);
  };

  const handleSave = () => {
    updateParentTitle(title);
    setEditMode(false);
  };

  useEffect(() => {
        const splitText = header.split('\n').map((line: any) => line.replace(/#### /g, '').replace(/- /g, ''));
        if (splitText.length > 0) {
            setTitle(splitText[0]);
        }
        if (splitText.length > 1) {
            setDescription(splitText.slice(1).join('\n'));
        }
    }, [editMode, name]);

    //update sheetStyle every time style changes:
    useEffect(() => {
        setSheetType(style);
    }, [style]);


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value.trim()===''){
        setTitle('');
    }else{
        setTitle(e.target.value);
    }
    // combine the title and description again for the update
    setName(`${e.target.value}\n${description}`);
};

const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.trim() === '') {
        // if it is empty, set the description to an empty string
        setDescription('');
    } else {
        // if it's not empty, update the description with the new value
        setDescription(e.target.value);
    }
    // combine the title and description again for the update
    setName(`${title}\n${e.target.value}`);
};

const components = {
    ul: ({ children }:any) => <ul className={styles.customCounter}>{children}</ul>,
    li: ({ children }:any) => (
        <li className={children && children.toString().trim() ? styles.customCounterItem : ''}>
          {children}
        </li>
      ),
  };

  return(
    <>
      {editMode ? (
        <div className={styles.editContainer}>
            {/* <div className={styles.leftSide}></div>  */}
            <div className={`${styles[`leftSide-${sheetType}`]}`}></div>
            {/* <div className={styles.basicInfoBg}> */}
            <Stack direction="column" sx={{
                direction: "center", borderRadius: "15px", 
                background:"linear-gradient(268deg, #F7FFEC -2.85%, rgba(236, 236, 255, 0.24) -2.84%, #F0F0F3 100%)",
                boxShadow: "9.99977px 9.99977px 29.9993px 0px rgba(174, 174, 192, 0.40)",
                position:"relative",
                width:"98%",
                height:"100%"

            }}>

                <div className={styles.inputs}>
                    <input 
                        type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                        className={styles.headerTitleInput}
                        autoFocus
                    />

                    <div className={styles.headerDesc2}>
                        <textarea
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            className={styles.headerDescInput}              
                        />
                    </div>
                </div>

                <Button style={{
                    display: "inline-flex", height: "42px", padding: "14px 45px", 
                    justifyContent: "center", alignItems: "center", gap:"10px", flexShrink: "0",
                    borderRadius: "10px", 
                    background: sheetType==='class' ? "#3B346F" : "#42483F",
                    alignSelf:"flex-end", marginTop: "30px", marginRight: "80px", marginBottom: "30px"

                }} onClick={handleSave}>
                    <div className={styles.buttonText}>完成</div>
                </Button>

            </Stack>        
        </div>
      ) : (
          <>
            <div className={`${styles[`parentCard-${sheetType}`]}`} >
                {/* <div className={styles.circle}><Circle/></div> */}
                <div className={`${styles[`circle-${sheetType}`]}`}><Circle type={sheetType}/></div>
                {/* <div className={styles.rectangle}></div> */}
                <div className={`${styles[`rectangle-${sheetType}`]}`}></div>
                <div className={styles.flexRow}>
                    <div className={styles.centered}>
                    <Edit onClick={handleEdit}>编辑</Edit>
                    </div>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    {/* <ReactMarkdown children={header} components={components}/> */}
                </div>
                <p className={styles.headerDesc1}>{description}</p>
            </div>
          </>
      )}
    </>
  );

}

//destructure type prop
const Circle: React.FC<{type: string}> = ({ type }) => (

    <svg xmlns="http://www.w3.org/2000/svg" width="116" height="106" viewBox="0 0 116 106" fill="none">
    <ellipse opacity="0.35" cx="37.5" cy="80" rx="78.5" ry="80" fill="url(#paint0_linear_1_562)"/>
    <defs>
        <linearGradient id="paint0_linear_1_562" x1="37.5" y1="0" x2="37.5" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor= {type==='class' ? "#8661E4" : "#61E466"} />
        <stop offset="1" stopColor= {type==='class'? "#62B3EB" : "#B7EB62"} stopOpacity="0"/>
        </linearGradient>
    </defs>
    </svg>

);

interface AddProps extends React.SVGProps<SVGSVGElement> {}
const Add: React.FC<AddProps> = (props) => (

    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none" style={{ cursor: 'pointer' }} {...props}>
    <path d="M12.5 2.50207C18.0138 2.50207 22.5 6.98853 22.5 12.5025C22.5 18.0165 18.0138 22.503 12.5 22.503C6.98625 22.503 2.5 18.0165 2.5 12.5025C2.5 6.98853 6.98625 2.50207 12.5 2.50207ZM12.5 0.00195312C5.59625 0.00195312 0 5.59847 0 12.5025C0 19.4066 5.59625 25.0031 12.5 25.0031C19.4037 25.0031 25 19.4066 25 12.5025C25 5.59847 19.4037 0.00195312 12.5 0.00195312ZM18.75 11.2525H13.75V6.25225H11.25V11.2525H6.25V13.7526H11.25V18.7528H13.75V13.7526H18.75V11.2525Z" fill="#545454"/>
    </svg>

);

const Up: React.FC< {onClick: () => void }> = (props) => (

    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none" style={{ cursor: 'pointer' }} {...props}>
    <path d="M14.5 27.2338V2.23376" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 14.7338L14.5 2.23376L27 14.7338" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

);

const Down: React.FC < {onClick: () => void }>= (props) => (

    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none"style={{ cursor: 'pointer' }} {...props}>
    <path d="M14.5 2.23376V27.2338" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 14.7338L14.5 27.2338L27 14.7338" stroke="#545454" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

);

//interface DeleteSectionProps extends React.SVGProps<SVGSVGElement> {}
const Delete: React.FC<{onClick: () => void }> = (props) => (

    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="27" viewBox="0 0 23 27" fill="none" style={{ cursor: 'pointer' }} onClick={props.onClick}>
    <path d="M4.25 26.3317C3.47083 26.3317 2.80358 26.0541 2.24825 25.4987C1.69292 24.9434 1.41572 24.2766 1.41667 23.4984V5.08173H0V2.24839H7.08333V0.831726H15.5833V2.24839H22.6667V5.08173H21.25V23.4984C21.25 24.2776 20.9723 24.9448 20.417 25.5001C19.8617 26.0555 19.1949 26.3327 18.4167 26.3317H4.25ZM18.4167 5.08173H4.25V23.4984H18.4167V5.08173ZM7.08333 20.6651H9.91667V7.91506H7.08333V20.6651ZM12.75 20.6651H15.5833V7.91506H12.75V20.6651Z" fill="#545454"/>
    </svg>

);

const DeleteSub: React.FC< {onClick: () => void }> = (props) => (

    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 27" fill="none" style={{ cursor: 'pointer' }} {...props}>
    <path d="M4.25 26.3317C3.47083 26.3317 2.80358 26.0541 2.24825 25.4987C1.69292 24.9434 1.41572 24.2766 1.41667 23.4984V5.08173H0V2.24839H7.08333V0.831726H15.5833V2.24839H22.6667V5.08173H21.25V23.4984C21.25 24.2776 20.9723 24.9448 20.417 25.5001C19.8617 26.0555 19.1949 26.3327 18.4167 26.3317H4.25ZM18.4167 5.08173H4.25V23.4984H18.4167V5.08173ZM7.08333 20.6651H9.91667V7.91506H7.08333V20.6651ZM12.75 20.6651H15.5833V7.91506H12.75V20.6651Z" fill="#545454"/>
    </svg>

);


interface EditProps extends React.SVGProps<SVGSVGElement> {}
const Edit: React.FC<EditProps> = (props) => (

  <svg 
    xmlns="http://www.w3.org/2000/svg" width="41" height="41" 
    viewBox="0 0 41 41" fill="none"
    {...props}
  >
    <path d="M11.9584 11.9583H10.25C9.34388 11.9583 8.47484 12.3182 7.83409 12.959C7.19334 13.5997 6.83337 14.4688 6.83337 15.3749V30.7499C6.83337 31.6561 7.19334 32.5251 7.83409 33.1659C8.47484 33.8066 9.34388 34.1666 10.25 34.1666H25.625C26.5312 34.1666 27.4002 33.8066 28.041 33.1659C28.6817 32.5251 29.0417 31.6561 29.0417 30.7499V29.0416" stroke="#F0F0F0" strokeOpacity="0.96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M27.3333 8.54161L32.4583 13.6666M34.8244 11.2493C35.4972 10.5765 35.8752 9.66395 35.8752 8.71244C35.8752 7.76093 35.4972 6.84838 34.8244 6.17556C34.1516 5.50274 33.239 5.12476 32.2875 5.12476C31.336 5.12476 30.4234 5.50274 29.7506 6.17556L15.375 20.4999V25.6249H20.5L34.8244 11.2493Z" stroke="#F0F0F0" strokeOpacity="0.96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

);


function BasicInfo({data, updateParent, updateBasicInfoDeleted, style, onSideBarAdd}: any){

    //data: "basic_info":["学校","年级","学科","执教老师"],
    const [templateData, setTemplateData] = useState<any[]>(Array.isArray(data) ? data : []);
    // const [basicInfoDeleted, setBasicInfoDeleted] = useState(false);
    const [item, setItem] = useState('学校');
    const [editMode, setEditMode] = useState(false);
    const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);
    const [sheetType, setSheetType] = useState(style);

    //update sheetStyle every time style changes:
    useEffect(() => {
        setSheetType(style);
    }, [style]);

    const handleSubClick = (index:any) => {
        setSelectedSubIndex(index);
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSave = () => {
        console.log("saving...");
        let newBasicInfo = templateData;
        updateParent(newBasicInfo);
        setEditMode(false);
    };

    const handleAdd = () => {
        console.log("start to add...");
        setTemplateData((prevTemplateData: any) => {
            return Array.isArray(prevTemplateData) ? [...prevTemplateData, ''] : [''];
        });
    }

    const handleDelete = (index: number) =>{

        console.log("start to delete...")
        setTemplateData((prevTemplateData: any) => {
            return prevTemplateData.filter((_: any, i: number) => i !== index);
        });
    }

    const handleDeleteSection = ()=>{
        //"index" is the i in templateData.criteria[i]
        console.log("delete the entire basic_info section...");
        updateBasicInfoDeleted(true);
    }

    const handleMoveSubUp = () =>{

        console.log("moving up...");
        if(selectedSubIndex == null || selectedSubIndex<=1) return;
        console.log("selected sub index: "+selectedSubIndex);
        setTemplateData((prevTemplateData)=>{
            const newBasicInfoArray = [...prevTemplateData];
            [newBasicInfoArray[selectedSubIndex], newBasicInfoArray[selectedSubIndex-2]]=[newBasicInfoArray[selectedSubIndex-2], newBasicInfoArray[selectedSubIndex]];
            return newBasicInfoArray;
        });
        setSelectedSubIndex(selectedSubIndex-2);
    }

    const handleMoveSubDown = () =>{

        console.log("moving down...")
        if(selectedSubIndex == null || selectedSubIndex>=templateData.length-2) return;
        console.log("selected sub index: "+selectedSubIndex);
        setTemplateData((prevTemplateData)=>{
            const newBasicInfoArray = [...prevTemplateData];
            [newBasicInfoArray[selectedSubIndex], newBasicInfoArray[selectedSubIndex+2]]=[newBasicInfoArray[selectedSubIndex+2], newBasicInfoArray[selectedSubIndex]];
            return newBasicInfoArray;
        });
        setSelectedSubIndex(selectedSubIndex+2);
    }

    const handleItemUpdate = (index: number, newItem: string) => {
        setTemplateData((prevTemplateData: any) => {
            const newTemplateData = [...prevTemplateData];
            newTemplateData[index] = newItem;
            return newTemplateData;
        });
    };

    return(
    <>
        {editMode ? (         
            <div className={styles.editContainer}>
                {/* <div className={styles.leftSide}></div>  */}
                <div className={`${styles[`leftSide-${sheetType}`]}`}></div>
                {/* <div className={styles.basicInfoBg}> */}
                <Stack direction="column" sx={{
                    direction: "center", borderRadius: "15px", 
                    background: "linear-gradient(268deg, #F7FFEC -2.85%, rgba(236, 236, 255, 0.24) -2.84%, #F0F0F3 100%)",
                    boxShadow: "9.99977px 9.99977px 29.9993px 0px rgba(174, 174, 192, 0.40)",
                    position:"relative",
                    width:"98%",
                    height:"100%"
                }}>
                    {/* <div className={styles.student1Edit}> */}
                    <div className={`${styles[`student1Edit-${sheetType}`]}`}>
                        <h1 className={styles.studentTitle1Edit}>Basic Information</h1>
                    </div>
                    <div className={styles.sideBar}>
                        <div className={styles.sideBarSvg}><Add onClick={()=>{onSideBarAdd()}}/></div>
                        <div className={styles.sideBarSvg} ><Up onClick={handleMoveSubUp}/></div>
                        <div className={styles.sideBarSvg}><Down onClick={handleMoveSubDown}/></div>
                        <div className={styles.sideBarSvg}><Delete onClick={handleDeleteSection}/></div>
                    </div>

                    <div className={styles.basicInfoGrid1}>
                                
                        {templateData && templateData.map((item:any, index:any)=> (

                            <BasicInfoSub key={index} data={item} i={index} 
                                editMode={editMode}
                                onItemUpdate={(newItem: any) => handleItemUpdate(index, newItem)}
                                onDelete={() => handleDelete(index)}
                                onClick={() => handleSubClick(index)}
                            />                            
                        ))}
                            
                    </div>

                    <div className={styles.addBttContainer}>
                        <Button onClick={handleAdd} sx={{border: "none", background: "none", color: "#3D3B4F"}}>+点击添加评分项</Button>
                    </div>

                    
                    <Button style={{
                        display: "inline-flex", height: "42px", padding: "14px 45px", 
                        justifyContent: "center", alignItems: "center", gap:"10px", flexShrink: "0",
                        borderRadius: "10px", 
                        background: sheetType==='class' ? "#3B346F" : "#42483F",
                        alignSelf:"flex-end", marginTop: "30px", marginRight: "80px", marginBottom: "30px"

                    }} onClick={handleSave}>
                        <div className={styles.buttonText}>完成</div>
                    </Button>

                </Stack>             
            </div>
            
        ) : (
            <>
                <div className={styles.basicInfoBg} >
                    <div className={`${styles[`student1-${sheetType}`]}`}>
                        <div style={{display:'flex'}}>
                            <div className={styles.centered}>
                                <Edit onClick={handleEdit}></Edit>
                            </div>
                            <div>
                                <h1 className={styles.studentTitle1}>Basic Information</h1>
                            </div>
                        </div>
                    </div>

                    <div className={styles.basicInfoGrid}>                     
                        {templateData && templateData.map((item:any, index:any)=> (
                            <BasicInfoSub 
                                key={index} data={item} i={index} 
                                // editMode={editMode}
                                // onItemUpdate={handleItemUpdate}
                            />                   
                        ))}                   
                    </div>

                </div>
            </>
        )}   
    </>
    );

}

function BasicInfoSub({data, i, editMode, onItemUpdate, onClick, onDelete}:any){

    //data is an item of the basic_info array
    const [item, setItem] = useState('');

    useEffect(() => {
        setItem(data);
      }, [editMode, data]);
    
    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.trim()===''){
            setItem('');
        }else{
            setItem(e.target.value);
        }
        onItemUpdate(e.target.value)
    };
    
    const [isClicked, setIsClicked] = useState(false);

    const handleToggleClick = () => {
        setIsClicked(!isClicked);
        if(onClick){
            onClick();
        }
    };

    return(
        
        <div onClick={handleToggleClick}>
            {editMode ? (
                <div>                
                    {isClicked && (
                        <div className={styles.deleteSub2}>
                            <DeleteSub onClick={() => onDelete()} />
                        </div> 
                    )} 
                    <input
                    value={item}
                    type="text"
                    placeholder="添加新项目..."
                    //onInput={autoResizeTextarea}
                    className={styles.editTextArea0}
                    //onCompositionStart={handleCompositionStart}
                    //onCompositionEnd={handleCompositionEnd}
                    onChange={handleItemChange}
                    />
                </div>
            ):(
                <div>
                    <h4 className={styles.basicInfoText} >{data}</h4>
                </div>
            )}
        </div>
    );
}

{/* <Criteria 
criteria1={criteriaItem} userData={targetData} i={index} 
onSideBarDelete={()=>handleDeleteSection(index)}
updateParent={updateCriteriaOrder}
/> */}
// targetData?.criteria?.map((criteriaItem:any, index:any)

function Criteria({criteria1, userData, i, onSideBarDelete,updateParent, style, onSideBarAdd}:any){

    const [sheetType, setSheetType] = useState(style);

    useEffect(() => {
        setSheetType(style);
    }, [style]);

    // console.log("index is: "+i);
    useEffect(() => {
        console.log(`Criteria ${i}:`, criteria1);
      }, [criteria1, userData, i]);

    //const userData = oldTemplateData.message.find((m:any) => m.uuid === '010acce7-9b36a354-90dc400e-76f3e902');

    const [selectedSubIndex, setSelectedSubIndex] = useState<number | null>(null);
    const handleSubClick = (index:any) => {
        setSelectedSubIndex(index);
    };

    const [templateData, setTemplateData] = useState<any>(userData);

    //update templateData every time userData changes:
    useEffect(() => {
        setTemplateData(userData);
      }, [userData]);

    // console.log(`templateData:`, templateData);
    // console.log(`userData:`, userData);
    const [title1, setTitle1] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [commentMode, setCommentMode] = useState(false);

    const handleEdit = () => {
        console.log("can edit....");
        setEditMode(true);
    };

    const handleAdd = () =>{
        console.log("start to add...")
        setTemplateData(
            (prevTemplateData: any)=>{
                const newCritieria={
                    maxPoints: 0,
                    description: 0,
                }
                // create a deep copy of the previous template data
                const newTemplateData = JSON.parse(JSON.stringify(prevTemplateData));
                if(!newTemplateData.criteria[i].criteria){
                    newTemplateData.criteria[i].criteria=[];
                }
                newTemplateData.criteria[i].criteria.push(newCritieria);
                return newTemplateData;
            }
        );
    }

    const handleTextUpdate = (index: number, newText: string) => {

        setTemplateData((prevTemplateData: any) => {
            // first, ensure that prevTemplateData has the expected structure
            if (!prevTemplateData?.criteria?.[i]?.criteria?.[index]) {
                console.error('Invalid template data structure or index out of bounds');
                return prevTemplateData; // return previous state if structure is not as expected
            }
    
            const newTemplateData = { ...prevTemplateData };          
            newTemplateData.criteria[i].criteria[index].description = newText;
            return newTemplateData;
        });
    };

    const handleScoreUpdate=(index: any, newScore:any)=>{

        setTemplateData((prevTemplateData:any) => {
            // clone the outer structure
            const newTemplateData = { ...prevTemplateData };
            // deep clone the criteria array you will be changing
            newTemplateData.criteria[i].criteria = [...newTemplateData.criteria[i].criteria];
            // update the specific item
            newTemplateData.criteria[i].criteria[index] = {
                ...newTemplateData.criteria[i].criteria[index],
                maxPoints: newScore==null? 0: newScore,
            };
            const newTotalMaxPoints = newTemplateData.criteria[i].criteria.reduce((total: any, criterion: any)=>total+Number(criterion.maxPoints), 0);
            newTemplateData.criteria[i].maxPoints = newTotalMaxPoints;
            return newTemplateData;
        });
    };

    const formatTextForSave = (text:any, idx:any) => {

        //text is: criteria[i].criteria.description
        //lines: [“兴趣习惯”，“喜欢学习语文...”，“听说读写...”]
        if(!text || typeof text !== 'string'){
            return '';
        }
            
        let lines = text.split('\n');
        return lines.map((line:any, index:any) => {
            if (index === 0) {
                // eemove any existing '#### <number>.' pattern
                line = line.replace(/#### \d+\./, '');
                // trim any whitespace that may be left at the start of the line after replacing
                line = line.trim();
                // prepend the new index
                return `#### ${idx+1}.${" "}${line}`;
            } else if (index !== 0 && !line.startsWith("- ")) {
                return `- ${line}`;
            }
            return line;
        }).join('\n');

    };

    const handleSave = () => {

        console.log("Saving...");

        // first, filter and map criteria as before
        let newCriteria = templateData.criteria.map((criteria1: any, criteria1Index: number) => {
            if (criteria1Index === i) {
                const filteredSubCriteria = criteria1.criteria
                    .filter((crit: any) => typeof crit.description === 'string' && crit.description.trim().length > 0)
                    .map((crit: any, critIndex: number) => ({
                        ...crit,
                        description: formatTextForSave(crit.description, critIndex),
                        maxPoints: crit.maxPoints
                    }));

                return {
                    ...criteria1,
                    criteria: filteredSubCriteria, //criteria1.criteria = filteredSubCriteria
                    comments: commentMode ? "true" : "false",
                    description: title1,
                };
            } else {
                return criteria1;
            }
        });

        // check if the sub-criteria array for the current criterion is empty and move to end if so
        if (newCriteria[i].criteria.length === 0) {
            const itemToMove = newCriteria.splice(i, 1)[0]; // remove the item at index i
            newCriteria.push(itemToMove); // add it to the end
        }

        // set the new state with updated criteria
        setTemplateData((prevTemplateData: any) => ({
            ...prevTemplateData,
            criteria: newCriteria
        }));
        setEditMode(false);
        updateParent(newCriteria);
    };  

    const handleDelete = (subIndex: number) => {
        console.log("index to be deleted:" + subIndex);
        setTemplateData((prevTemplateData: any) => {
            const newCriteria = [...prevTemplateData.criteria];
            const newSubCriteria = [...newCriteria[i].criteria];
            newSubCriteria.splice(subIndex, 1);
            if (newSubCriteria.length === 0){
                newCriteria[i].criteria = [];
            }else{
                newCriteria[i].criteria = newSubCriteria;
            }
            return {
                ...prevTemplateData,
                criteria: newCriteria,
            };

        });
    };

    const handleMoveSubUp = () => {
        console.log("moving up...");
        if (selectedSubIndex == null || selectedSubIndex <= 0) return;
        console.log("selected sub index: " + selectedSubIndex);
      
        setTemplateData((prevTemplateData:any) => {
          const newCriteriaArray = [...prevTemplateData.criteria[i].criteria];
          [newCriteriaArray[selectedSubIndex], newCriteriaArray[selectedSubIndex - 1]] = [newCriteriaArray[selectedSubIndex - 1], newCriteriaArray[selectedSubIndex]];
          
          console.log(newCriteriaArray);
          const newTemplateData = { ...prevTemplateData };
          newTemplateData.criteria[i].criteria = newCriteriaArray;
      
          return newTemplateData;
        });
        
        // update the selected index to the new position
        setSelectedSubIndex(selectedSubIndex - 1);
      };
      
      const handleMoveSubDown = () => {
        if (selectedSubIndex == null || selectedSubIndex >= templateData.criteria[i].criteria.length - 1) return;
      
        setTemplateData((prevTemplateData:any) => {
          const newCriteriaArray = [...prevTemplateData.criteria[i].criteria];
          [newCriteriaArray[selectedSubIndex], newCriteriaArray[selectedSubIndex + 1]] = [newCriteriaArray[selectedSubIndex + 1], newCriteriaArray[selectedSubIndex]];
          
          const newTemplateData = { ...prevTemplateData };
          newTemplateData.criteria[i].criteria = newCriteriaArray;
      
          return newTemplateData;
        });
      
        // update the selected index to the new position
        setSelectedSubIndex(selectedSubIndex + 1);
      };
      

    useEffect(() => {
        if (templateData?.criteria?.[i]) {
            //console.log(`templateData:`, templateData);
            setTitle1(templateData.criteria[i].description); //title1: 1.兴趣习惯

        }
    }, [templateData, i]); // depend on i as well if it's a prop or can change

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.trim()===''){
            setTitle1('');
        }else{
            setTitle1(e.target.value);
        }
    };

    return(
        <>
        {editMode ? (
            <>
            <div className={styles.editContainer}>
                <div className={`${styles[`leftSide-${sheetType}`]}`}></div>  
                <Stack direction="column" sx={{
                    direction: "center", borderRadius: "15px", 
                    background:"linear-gradient(268deg, #F7FFEC -2.85%, rgba(236, 236, 255, 0.24) -2.84%, #F0F0F3 100%)",
                    boxShadow: "9.99977px 9.99977px 29.9993px 0px rgba(174, 174, 192, 0.40)",
                    position:"relative",
                    width:"98%",
                    height:"100%"
                }}>                                             
                    <div className={`${styles[`student1Edit-${sheetType}`]}`}>
                        <input
                            value={title1}
                            type="text"
                            onChange={handleTitleChange}
                            placeholder="添加一级标题"
                            className={styles.editTextArea1}
                            style={{ fontSize: '28px' }}
                        />
                        <div className={styles.totalScore}>
                            <p>
                                {templateData?.criteria?.[i]?.maxPoints}
                            </p>
                        </div>
                    </div>
                    
                    <div className={styles.sideBar}>
                        <div className={styles.sideBarSvg}><Add onClick={()=>{onSideBarAdd()}}/></div>
                        <div className={styles.sideBarSvg} ><Up onClick={handleMoveSubUp}/></div>
                        <div className={styles.sideBarSvg}><Down onClick={handleMoveSubDown}/></div>
                        <div className={styles.sideBarSvg}><Delete onClick={()=>{onSideBarDelete()}}/></div>
                    </div>

                    {templateData?.criteria?.[i]?.criteria?.map((crit: any, index: number) => (
                        <Sub
                            key={index}
                            crit={crit}
                            editMode={editMode}
                            onTextUpdate={(newText: any) => handleTextUpdate(index, newText)}
                            onScoreUpdate={(newScore: any) => handleScoreUpdate(index, newScore)}
                            onDelete={() => handleDelete(index)}
                            onClick={() => handleSubClick(index)}                                                          
                        />
                    ))}

                    <div className={styles.addBttContainer}>
                        <Button onClick={handleAdd} sx={{border: "none", background: "none", color: "#3D3B4F"}}>+点击添加评分项</Button>
                    </div>

                    <div className={styles.toggleContainer}>
                        <div
                            className={styles.toggleBackground}
                            style={{ left: commentMode ? '0%' : '50%' }} 
                        />                       
                            <button
                            onClick={() => setCommentMode(true)}
                            className={styles.toggleButton}
                            >
                            包含评语
                            </button>
                            <button
                            onClick={() => setCommentMode(false)}
                            className={styles.toggleButton}
                            >
                            无评语
                            </button>                        
                    </div>

                    {commentMode && (<SubComment/>)} 
          
                    <Button style={{
                        display: "inline-flex", height: "42px", padding: "14px 45px", 
                        justifyContent: "center", alignItems: "center", gap:"10px", flexShrink: "0",
                        borderRadius: "10px", 
                        background: sheetType==='class' ? "#3B346F" : "#42483F",
                        alignSelf:"flex-end", marginTop: "30px", marginRight: "80px", marginBottom: "30px"

                    }} onClick={handleSave}>
                        <div className={styles.buttonText}>完成</div>
                    </Button>

                </Stack>
            </div>
            </>
        ) : (
            <>
            <div className={styles.studentBg} id="editContainer">
                <div className={`${styles[`student1-${sheetType}`]}`} >
                    <div style={{display:'flex'}}>                  
                        <div className={styles.centered}>
                            <Edit onClick={handleEdit}></Edit>
                        </div>
                        <div>
                            <h1 className={styles.studentTitle1}>{title1}</h1>
                        </div>
                    </div>
             
                    <div className={styles.totalScore}>
                        <p>
                            {templateData?.criteria?.[i]?.maxPoints}
                        </p>
                    </div>

                </div>
                <div>                 
                    {templateData?.criteria?.[i]?.criteria?.map((crit: any) => (
                    <Sub key={crit.description} crit={crit}/>                  
                    ))}            
                </div>

                { templateData.criteria[i].comments==="true" && (<SubComment/>)}
            </div>  
            </>
            )}
        </>       
    );

}

function SubComment(){
    return (
        <div className={styles.subComment}>
            <textarea
            placeholder="Comment on the Course"  
            className={styles.subCommentText}   
            />
        </div>
    )
}

// {templateData?.criteria?.[i]?.criteria?.map((crit: any, index: number) => (
//     <Sub
//         key={index}
//         crit={crit}
//         editMode={editMode}
//         onTextUpdate={(newText: any) => handleTextUpdate(index, newText)}
//         onScoreUpdate={(newScore: any) => handleScoreUpdate(index, newScore)}
//         onDelete={() => handleDelete(index)}
//         onClick={() => handleSubClick(index)}                                    
//     />
// ))}

function Sub({crit, editMode, onTextUpdate, onScoreUpdate, onDelete, onClick, isSelected}: any){

    const [isClicked, setIsClicked] = useState(false);
    const [score, setScore] = useState(crit.maxPoints || '');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [inputText, setInputText] = useState('');
    const content=crit.description
    const [isHovered, setIsHovered] = useState(false);

    const components = {
        ul: ({ children }:any) => <ul className={styles.customCounter}>{children}</ul>,
        li: ({ children }:any) => (
            <li className={children && children.toString().trim() ? styles.customCounterItem : ''}>
              {children}
            </li>
          ),
      };

    useEffect(() => {
        if (editMode && crit?.description && typeof crit.description === 'string') {
            //whenever in edit mode, parse the data so that markdown is not displayed
            const splitText = crit.description.split('\n').map((line: any) => line.replace(/#### /g, '').replace(/- /g, ''));
            if (splitText.length > 0) {
                setTitle(splitText[0]);
            }
            if (splitText.length > 1) {
                setDescription(splitText.slice(1).join('\n'));
            }
        } else {
            // set default values if data.description is not available
            setTitle('');
            setDescription('');
        }
    }, [editMode, crit.description]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.trim()===''){
            setTitle('');
        }else{
            setTitle(e.target.value);
        }
        
        // combine the title and description again for the update
        onTextUpdate(`${e.target.value}\n${description}`);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.trim() === '') {
            // if it is empty, set the description to an empty string
            setDescription('');
        } else {
            // if it's not empty, update the description with the new value
            setDescription(e.target.value);
        }
        // combine the title and description again for the update
        onTextUpdate(`${title}\n${e.target.value}`);
    };

    const handleScoreChange = (newScore:any) =>{
        // setScore(e.target.value);
        onScoreUpdate(newScore);
    };

    const autoResizeTextarea = (e:any) => {
        e.target.style.height = 'inherit'; // Reset the height
        const computed = window.getComputedStyle(e.target);
        
        // calculate the height
        const height = parseInt(computed.getPropertyValue('border-top-width'), 10)
                     + e.target.scrollHeight
                     + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    
        e.target.style.height = `${height}px`;
    };

    const handleToggleClick = () => {
        setIsClicked(!isClicked);
        if(onClick){
            onClick();
        }
    };

    const subClassName = `${styles.sub} ${isSelected ? styles.selectedSub : ''}`;

    return <div className={subClassName} onClick={handleToggleClick}>
        { editMode? (
            <div className={styles.text1}>
                {isClicked && (
                    <div className={styles.deleteSub}>
                        <DeleteSub onClick={() => onDelete()} />
                    </div> 
                )}                     
                <input
                value={title}
                type="text"
                onChange={handleTitleChange}
                onInput={autoResizeTextarea}
                placeholder="添加新指标"
                className={styles.editTextArea1}
                />
                            
                <textarea
                    value={description}
                    onChange={handleDescriptionChange}
                    onInput={autoResizeTextarea}
                    placeholder="补充指标说明"
                    className={styles.editTextArea2}
                />                 
            </div>

        ) : (
                <div>               
                    <ReactMarkdown children={content} components={components}/>
                </div>
            )
        }

        { editMode?(
            <div>
                <input 
                    type="text" 
                    value={crit.maxPoints}
                    onChange={(e) => handleScoreChange(e.target.value)}
                    placeholder="0"
                    className={styles.editScoreInput}
                    
                />
            </div>
        ):(
            <div className={styles.score}>
                <p>{score}</p>
            </div>
            )
        }
    </div>
}

function EditTemplate({id, type}: any) {

    const [targetData, setTargetData] = useState<any>(null);
    const [fullData, setFullData] = useState<any>(null);
    const [basicInfoDeleted, setBasicInfoDeleted] = useState(false);
    const [scoresheetId, setScoreSheetId] = useState(id);
    const [scoresheetType, setscoresheetType] = useState(type);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('http://api.linghangxiong.com/scoresheet/rubrics/f7ea5a24-d22c-4a29-980f-2fab791d1773?type=class');
                //const response = await fetch(`http://api.linghangxiong.com/scoresheet/rubrics/${scoresheetId}?type=${scoresheetType}`);
                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }
                // const data = await response.json();
                const data=MockData;
                setFullData(data);
                console.log(data.message);
                const target = data.message.find((m: any) => m.uuid === `${"010acce7-9b36a354-90dc400e-76f3e902"}`);
                setTargetData(target);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    if (!targetData) {
        return <div>Loading...</div>;
    }

    const handleSave = async () => {
        console.log("saving to backend...");
        // console.log(targetData);
        let totalMaxPoints = 0;

        targetData.criteria.forEach((criterion: any) => {
            totalMaxPoints += criterion.maxPoints;
        });

        const updatedTargetData = {
            ...targetData,
            max_points: totalMaxPoints
        };
    
        // update the part of the fullData that corresponds to targetData based on uuid
        const updatedFullData = {
            ...fullData,
            message: fullData.message.map((m: any) =>
                m.uuid === targetData.uuid ? updatedTargetData : m
            )
        };

        console.log("updatedTargetData: ", updatedTargetData);
    
        try {
            const response = await fetch(`http://api.linghangxiong.com/scoresheet/rubrics/${scoresheetId}?type=${scoresheetType}`, {
                method: 'PUT', // or 'POST'
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFullData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Save successful:', result);

        } catch (error) {
            console.error('Error saving data:', error);

        }
    };
    
    const handleDeleteSection = (id: any)=>{

        console.log("deleting section from parent at index:", id);
        setTargetData((prevTargetData: any) => {
            console.log("previous template data:", prevTargetData);
    
            // make sure there's a criteria array
            if (!prevTargetData?.criteria) {
                console.error('No criteria found in the template data');
                return prevTargetData;
            }
    
            const updatedCriteria = [...prevTargetData.criteria]; // create a copy of the criteria array
            updatedCriteria.splice(id, 1); // remove the item at the specified index

            console.log("updated criteria after deletion:", updatedCriteria);
    
            const updatedSourceData = {
                ...prevTargetData,
                criteria: updatedCriteria,
            };
    
            console.log("new template data to be set:", updatedSourceData); 
            return updatedSourceData;
        });

    }

    const handleAddSection = (id: any)=>{

        console.log("adding section after index:", id);
        setTargetData((prevTargetData: any) => {
            console.log("previous template data:", prevTargetData);
    
            // make sure there's a criteria array
            if (!prevTargetData?.criteria) {
                console.error('No criteria found in the template data');
                return prevTargetData;
            }
    
            const updatedCriteria = [...prevTargetData.criteria]; // create a copy of the criteria array
            // TODO: add an empty element to the criteria array after index "id"
            const newElement = {
                criteria: [],
                maxPoints: 0,
                description: ""
            };

            // insert the new element after the specified index
            updatedCriteria.splice(id + 1, 0, newElement);
            console.log("updated criteria after adding:", updatedCriteria);  
            const updatedSourceData = {
                ...prevTargetData,
                criteria: updatedCriteria,
            };
            console.log("new template data to be set:", updatedSourceData); 
            return updatedSourceData;
        });
    }

    const handleAddSection0 = ()=>{

        setTargetData((prevTargetData: any) => {
            console.log("previous template data:", prevTargetData);
    
            // make sure there's a criteria array
            if (!prevTargetData?.criteria) {
                console.error('No criteria found in the template data');
                return prevTargetData;
            }
    
            const updatedCriteria = [...prevTargetData.criteria]; // create a copy of the criteria array
            // TODO: add an empty element to the criteria array after index "id"
            const newElement = {
                criteria: [],
                maxPoints: 0,
                description: ""
            };

            // insert the new element after the specified index
            // updatedCriteria.splice(id + 1, 0, newElement);
            updatedCriteria.splice(0, 0, newElement);

            console.log("updated criteria after adding:", updatedCriteria);
    
            const updatedSourceData = {
                ...prevTargetData,
                criteria: updatedCriteria,
            };
    
            console.log("new template data to be set:", updatedSourceData);
    
            return updatedSourceData;
        });

    }

    const updateCriteriaOrder = (newCriteria: any) => {
        setTargetData((prevTargetData: any) => ({
            ...prevTargetData,
            criteria: newCriteria //criteria: [criteria1, criteria2...]
        }));
    };

    const updateBasicInfo = (newBasicInfo: any)=>{
        setTargetData((prevTargetData: any)=>({
            ...prevTargetData,
            basic_info: newBasicInfo
        }))

    };

    const handleBasicInfoDelete = (basicInfoDeleted: boolean)=>{
        setBasicInfoDeleted(basicInfoDeleted);
    }

    const handleUpdateFormTitle = (formTitle: any)=>{
        setTargetData((prevTargetData: any) => ({
            ...prevTargetData,
            name: formTitle
        }));
    }

    return (
      <main className={styles.main}>
        <div className={styles.wrapper}>
            <h1 className={styles.title0}>Create Evaluation Form</h1>

            <Stack direction="column" sx={{direction: "center" }}>
            
                <div className={styles.grid}>
                    <div className={styles.cardAreaHeader}>
                    <Header updateParentTitle={handleUpdateFormTitle} header={targetData.name} style={scoresheetType}/>
                    {/* Then, in the child component, call updateParentTitle this way:
                    const handleSave = () => {
                        updateParentTitle(title);
                        setEditMode(false);
                    }; */}
                    </div>

                    <Stack>
                        {!basicInfoDeleted && 
                        <div className={styles.cardAreaBasicInfo}>
                        
                        <BasicInfo data={targetData?.basic_info} updateParent={updateBasicInfo} updateBasicInfoDeleted={handleBasicInfoDelete} 
                            style={scoresheetType} onSideBarAdd={handleAddSection0}
                        />
                        </div>
                        }

                        {/* loop through the criteria array */}
                        {targetData?.criteria?.map((criteriaItem:any, index:any) => (
                            <div 
                            key={index}
                            style={{
                                gridColumn: '1 / 1',
                                gridRow: `${index + 3} / ${index + 4}`,// dynamically set grid row
                                width: '100%',
                                height:'100%'                       
                            }}                       
                            >
                            <Criteria 
                            criteria1={criteriaItem} userData={targetData} i={index} 
                            onSideBarDelete={()=>handleDeleteSection(index)}
                            updateParent={updateCriteriaOrder}
                            style={scoresheetType}
                            onSideBarAdd={()=>handleAddSection(index)}
                            />
                            </div>
                        ))}
                    </Stack>
                </div>

                <Button style={{
                        display: "inline-flex", height: "42px", padding: "14px 45px", 
                        justifyContent: "center", alignItems: "center", gap:"10px", flexShrink: "0",
                        borderRadius: "10px", 
                        background: scoresheetType==='class' ? "#3B346F" : "#42483F",
                        alignSelf:"flex-end", marginTop: "50px", marginRight: "100px", 

                    }} onClick={handleSave}>
                        <div className={styles.buttonText}>Submit</div>
                </Button>

            </Stack>
          
        </div>
      </main>
    );
}

export default EditTemplate;

