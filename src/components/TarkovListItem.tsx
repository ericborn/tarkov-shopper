import { ListItem, ListItemDecorator, Typography } from '@mui/joy';
import { TarkovItem } from '../types/items';

interface TarkovListItemProps {
    item: TarkovItem;
}

export const TarkovListItem = ({ item }: TarkovListItemProps) => {
    return (
        <ListItem key={item.id}>
            <ListItemDecorator sx={{ mr: 2 }}>
                <img src={item.image} alt={item.name} />
            </ListItemDecorator>
            <Typography>{item.name}</Typography>
        </ListItem>
    );
};
