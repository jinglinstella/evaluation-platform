'use client'
import StatusDisplay from "./StatusDisplay";
import PriorityDisplay from "./PriorityDisplay";
import DeleteBlock from "./DeleteBlock";
import ProgressDisplay from "./ProgressDisplay";
import Link from "next/link";
import { Box } from "@mui/system";
import Card, { CardProps } from '@mui/material/Card';

const TicketCard = ({ ticket }:any) => {

  function formatTimestamp({timestamp}: any) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("en-US");

    return formattedDate;
  }

  const createdDateTime = formatTimestamp(ticket.createdAt);

  return (
    <Card sx={{width: '300px', padding:'10px'}}>
      <Box sx={{display: 'flex', justifyContent:'space-between'}}>
        <PriorityDisplay priority={ticket.priority} />
        <div>
          <DeleteBlock id={ticket._id} />
        </div>
      </Box>
      <Link href={`/test-one-ticket/${ticket._id}`} style={{ display: "contents" }}>
        <h4>{ticket.title}</h4>
        <p>{ticket.description}</p>
        <div>
          <div>
            <p>{createdDateTime}</p>
            <ProgressDisplay progress={ticket.progress} />
          </div>
          <div>
            <StatusDisplay status={ticket.status} />
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default TicketCard;