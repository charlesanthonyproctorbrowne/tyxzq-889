import {
  Card,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { useContacts } from '../../api';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

export const ContactsList = () => {
  const { data } = useContacts();
  const contacts = data?.data.data;

  if (!contacts) {
    return <Typography>Loading...</Typography>;
  }

  const Row = ({ index, style }: ListChildComponentProps) => {
    const contact = contacts[index];

    return (
      <ListItem style={style} key={contact.id}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary={contact.name} />
      </ListItem>
    );
  };

  return (
    <Card>
      <Typography variant="h6">Contacts</Typography>
      <FixedSizeList
        height={800}
        width={'100%'}
        itemSize={46}
        itemCount={contacts?.length}
        overscanCount={5}
      >
        {Row}
      </FixedSizeList>
    </Card>
  );
};
