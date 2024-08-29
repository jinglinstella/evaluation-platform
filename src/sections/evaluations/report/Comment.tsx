import React, { Fragment, useRef, useState } from "react"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import { MetricReport, MetricReportInstance } from "src/types/evaluation";
import TablePagination from '@mui/material/TablePagination';

interface Props {
    instance: MetricReportInstance
    selectedForm: number
    exportMode: boolean
}

const comment_questions = [
    [
        
        "question a",
        "question b"
        
    ],
    [   
        "question a",
        "question b"
        
    ],
    [    
        "question a",
        "question b"
        
    ]
  ]


export default function Comments({ instance, selectedForm, exportMode, ...others }: Props) {

    const comments = instance.comments;
    const commentQuestions = instance.comment_questions;

    return (

        <Box sx={{color: "#1F315F", fontFamily: "Helvetica", fontSize: "20px", fontStyle: "normal", fontWeight: "700", lineHeight: "118%"}}>
            <Typography variant="h5" p={2}>Comments</Typography>
                {comments[selectedForm] && comments[selectedForm].map((subComments, index) => (
                    exportMode? (
                        <React.Fragment key={`comment-${index}`}>
                            {/* <Box sx={{marginLeft: "15px", marginBottom: "10px"}}>{comment_questions[selectedForm][index]}</Box> */}
                            <Box sx={{marginLeft: "15px", marginBottom: "10px"}}>{commentQuestions && commentQuestions[selectedForm][index]}</Box>
                            
                            {subComments.map((subComment: any, i:any)=>(
                                <Card sx={{
                                    color: "#1F315F", 
                                    fontFamily: "Helvetica", fontSize: "15px", fontStyle: "normal", marginBottom: "20px"}}>
                                    <Typography sx={{marginLeft: "20px", marginTop: "10px", marginBottom:"10px"}}>{subComment}</Typography>
                                </Card>
                            ))}                       
                        </React.Fragment>
                    ) : (
                        <React.Fragment key={`comment-${index}`}>
                            {/* <Box sx={{marginLeft: "15px", marginBottom: "10px"}}>{comment_questions[selectedForm][index]}</Box> */}
                            <Box sx={{marginLeft: "15px", marginBottom: "10px"}}>{commentQuestions && commentQuestions[selectedForm][index]}</Box>
                            <SubCommentsCard subComments={subComments} />
                        </React.Fragment>
                    ) 
                ))}
        </Box>
    );  
}

function SubCommentsCard({ subComments}: any) {
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <Card sx={{color: "#1F315F", fontFamily: "Helvetica", fontSize: "20px", fontStyle: "normal", marginBottom: "20px"}}>
            <Typography sx={{marginLeft: "20px", marginTop: "10px"}}>{subComments[page]}</Typography>
            <TablePagination
                component="div"
                count={subComments.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={1}
                rowsPerPageOptions={[1]}
                labelDisplayedRows={({ from, to, count }) => `${page + 1}/${count}`}
            />
        </Card>
    );
}