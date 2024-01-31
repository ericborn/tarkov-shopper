import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchableList = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [displayedItems, setDisplayedItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('data.json'); // Replace with your JSON file path
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array means this effect runs once when the component mounts

    useEffect(() => {
        // Update the displayed items when the data or search term changes
        const filteredItems = data
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.shortname && item.shortname.toLowerCase().includes(searchTerm.toLowerCase())),
            )
            .slice(0, 10); // Display only the first 10 items

        setDisplayedItems(filteredItems);
    }, [data, searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleItemClick = (itemId) => {
        const selectedItem = data.find((item) => item.id === itemId);
        const existingSelectedItem = selectedItems.find((item) => item.id === itemId);

        if (existingSelectedItem) {
            // If the item is already in the selectedItems list, increase its quantity
            const updatedSelectedItems = selectedItems.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
            );
            setSelectedItems(updatedSelectedItems);
        } else {
            // If the item is not in the selectedItems list, add it with an initial quantity of 1
            setSelectedItems([...selectedItems, { ...selectedItem, quantity: 1 }]);
        }
    };

    const handleIncreaseQuantity = (itemId) => {
        const updatedSelectedItems = selectedItems.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        );
        setSelectedItems(updatedSelectedItems);
    };

    const handleDecreaseQuantity = (itemId) => {
        const updatedSelectedItems = selectedItems.map((item) =>
            item.id === itemId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item,
        );

        // Remove the item from the selectedItems list if the quantity is decreased to 1
        const filteredSelectedItems = updatedSelectedItems.filter((item) => item.quantity > 0);

        setSelectedItems(filteredSelectedItems);
    };

    const handleClearSelectedItems = () => {
        setSelectedItems([]);
    };

    const handleSortAlphabetically = () => {
        const sortedItems = [...selectedItems].sort((a, b) => a.name.localeCompare(b.name));
        setSelectedItems(sortedItems);
    };

    const handleSortReverseAlphabetically = () => {
        const sortedItems = [...selectedItems].sort((a, b) => b.name.localeCompare(a.name));
        setSelectedItems(sortedItems);
    };

    const handleSortByTotalQuantity = () => {
        const sortedItems = [...selectedItems].sort((a, b) => b.quantity - a.quantity);
        setSelectedItems(sortedItems);
    };

    const handleSortByReverseTotalQuantity = () => {
        const sortedItems = [...selectedItems].sort((a, b) => a.quantity - b.quantity);
        setSelectedItems(sortedItems);
    };

    const handleSaveSelectedItems = () => {
        const selectedItemsToSave = JSON.stringify(selectedItems);
        const blob = new Blob([selectedItemsToSave], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'selectedItems.json';
        link.click();
    };

    const handleImportSelectedItems = (event) => {
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedItems = JSON.parse(e.target.result);
                    setSelectedItems(importedItems);
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                }
            };

            reader.readAsText(file);
        }
    };

    return (
        <div style={{ padding: '35px' }}>
            <div class='navbar rounded-box bg-primary text-primary-content'>
                <button class='btn btn-ghost text-xl'>Tarkov Shopper</button>
            </div>
            <div style={{ marginTop: '10px' }}>
                <input
                    type='text'
                    placeholder='Search for an item...'
                    class='input input-bordered input-primary w-full max-w-xs'
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <ul style={{ listStyleType: 'none' }}>
                    {displayedItems.map((item) => (
                        <li style={{ marginTop: '10px' }}>
                            <button
                                class='btn btn-primary'
                                style={{ padding: '3px' }}
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                            >
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Selected Items</h2>
                <div>
                    <label for='load'>Load a saved set:</label>
                    <br />
                    <input
                        type='file'
                        id='load'
                        name='load'
                        accept='.json'
                        class='file-input file-input-bordered file-input-primary w-full max-w-xs'
                        onChange={handleImportSelectedItems}
                    />

                    <br />
                    <br />
                    <label for='save'>Save Current Item Set:</label>
                    <br />
                    <button class='btn btn-primary' onClick={handleSaveSelectedItems}>
                        Save
                    </button>
                    <br />
                    <br />
                    <button class='btn btn-primary' onClick={handleSortAlphabetically}>
                        Sort A-Z
                    </button>
                    <button class='btn btn-primary' onClick={handleSortReverseAlphabetically}>
                        Sort Z-A
                    </button>
                    <button class='btn btn-primary' onClick={handleSortByTotalQuantity}>
                        Sort by Total Quantity
                    </button>
                    <button class='btn btn-primary' onClick={handleSortByReverseTotalQuantity}>
                        Sort by Lowest Quantity
                    </button>
                </div>
                <ul>
                    {selectedItems.map((selectedItem) => (
                        <li key={selectedItem.id}>
                            <img
                                src={selectedItem.image}
                                alt={selectedItem.name}
                                style={{
                                    marginRight: '10px',
                                    marginLeft: '10px',
                                }} // Adjust styles as needed
                            />
                            {selectedItem.name} - Quantity: {selectedItem.quantity}{' '}
                            <button onClick={() => handleDecreaseQuantity(selectedItem.id)}>-</button>
                            <button onClick={() => handleIncreaseQuantity(selectedItem.id)}>+</button>{' '}
                        </li>
                    ))}
                </ul>
                <button class='btn btn-primary' onClick={handleClearSelectedItems}>
                    Clear Selected Items
                </button>
            </div>
        </div>
    );
};

export default SearchableList;
