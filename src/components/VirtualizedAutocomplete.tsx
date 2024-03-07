import {
    Autocomplete,
    AutocompleteListbox,
    AutocompleteOption,
    FormControl,
    ListItemContent,
    Typography,
    styled,
} from '@mui/joy';
import { Popper } from '@mui/base/Popper';
import {
    CSSProperties,
    Dispatch,
    SetStateAction,
    SyntheticEvent,
    createContext,
    forwardRef,
    useContext,
    useRef,
    useState,
} from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import items from '../constants/data.json';
import { TarkovItem } from '../types/items';

const LISTBOX_PADDING = 6; // px

function renderRow(props: ListChildComponentProps) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle: CSSProperties = {
        ...style,
        top: (style.top as number) + LISTBOX_PADDING,
    };
    const item = dataSet[1];

    return (
        <AutocompleteOption {...dataSet[0]} style={inlineStyle}>
            <ListItemContent>{item.name}</ListItemContent>
        </AutocompleteOption>
    );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = useContext(OuterElementContext);
    return (
        <AutocompleteListbox
            {...props}
            {...outerProps}
            component="div"
            ref={ref}
            sx={{
                '& ul': {
                    padding: 0,
                    margin: 0,
                    flexShrink: 0,
                },
            }}
        />
    );
});

// Adapter for react-window
const ListboxComponent = forwardRef<
    HTMLDivElement,
    {
        anchorEl: any;
        open: boolean;
        modifiers: any[];
    } & React.HTMLAttributes<HTMLElement>
>(function ListboxComponent(props, ref) {
    const { children, anchorEl, open, modifiers, ...other } = props;
    const itemData: Array<any> = [];
    (children as [Array<{ children: Array<React.ReactElement> | undefined }>])[0].forEach((item) => {
        if (item) {
            itemData.push(item);
            itemData.push(...(item.children || []));
        }
    });

    const itemCount = itemData.length;
    const itemSize = 50;

    return (
        <Popper ref={ref} anchorEl={anchorEl} open={open} modifiers={modifiers}>
            <OuterElementContext.Provider value={other}>
                <FixedSizeList
                    itemData={itemData}
                    height={itemSize * 8}
                    width="100%"
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={itemSize}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </FixedSizeList>
            </OuterElementContext.Provider>
        </Popper>
    );
});

const StyledDiv = styled('div')({
    flex: 1, // stretch to fill the root slot
    minWidth: 0, // won't push end decorator out of the autocomplete
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    position: 'relative',
});

type WrapperProps = {
    children: JSX.Element;
    hint: string;
};

function Wrapper({ children, hint, ...props }: WrapperProps) {
    return (
        <StyledDiv {...props}>
            <Typography sx={{ position: 'absolute', opacity: 0.6, marginLeft: '7.5px' }}>{hint}</Typography>
            {children}
        </StyledDiv>
    );
}

interface VirtualizedAutocompleteProps {
    setSelectedItems: Dispatch<SetStateAction<TarkovItem[]>>;
}

export const VirtualizedAutocomplete = ({ setSelectedItems }: VirtualizedAutocompleteProps) => {
    const hint = useRef('');
    const [inputValue, setInputValue] = useState('');
    const [currentValue, setCurrentValue] = useState<TarkovItem[]>([]);

    const handleItemSelect = (_event: SyntheticEvent<Element, Event>, value: TarkovItem[]) => {
        const newValue = value[0];
        newValue && setSelectedItems((prevValue) => [...prevValue, newValue]);
        setCurrentValue([]);
    };

    return (
        <FormControl>
            <Autocomplete
                value={currentValue}
                disableCloseOnSelect
                multiple
                renderTags={() => null}
                onInputChange={(_event, value) => {
                    if (!value) {
                        hint.current = '';
                    }
                    const matchingOption = items.find((option) => option.name.startsWith(value));
                    if (value && matchingOption) {
                        hint.current = matchingOption.name;
                    } else {
                        hint.current = '';
                    }
                    setInputValue(value);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Tab') {
                        if (hint.current) {
                            setInputValue(hint.current);
                            event.preventDefault();
                        }
                    }
                }}
                inputValue={inputValue}
                sx={{ width: 400 }}
                placeholder="Type to search"
                slots={{
                    listbox: ListboxComponent,
                    wrapper: Wrapper,
                }}
                slotProps={{
                    wrapper: {
                        hint: hint.current,
                    },
                    input: {
                        sx: {
                            zIndex: 1,
                        },
                    },
                }}
                options={items}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => [props, option] as React.ReactNode}
                onChange={handleItemSelect}
            />
        </FormControl>
    );
};
