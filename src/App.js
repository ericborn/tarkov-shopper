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
    }, []);

    useEffect(() => {
        const filteredItems = data
            .filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.shortname && item.shortname.toLowerCase().includes(searchTerm.toLowerCase())),
            )
            .slice(0, 5);

        setDisplayedItems(filteredItems);
    }, [data, searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleItemClick = (itemId) => {
        const selectedItem = data.find((item) => item.id === itemId);
        const existingSelectedItem = selectedItems.find((item) => item.id === itemId);

        if (existingSelectedItem) {
            const updatedSelectedItems = selectedItems.map((item) =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
            );
            setSelectedItems(updatedSelectedItems);
        } else {
            setSelectedItems([...selectedItems, { ...selectedItem, quantity: 1 }]);
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        const updatedSelectedItems = selectedItems.map((item) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item,
        );
        setSelectedItems(updatedSelectedItems);
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
        const filteredSelectedItems = updatedSelectedItems.filter((item) => item.quantity > 0);
        setSelectedItems(filteredSelectedItems);
    };

    const handleRemoveItem = (itemId) => {
        const updatedSelectedItems = selectedItems.filter((item) => item.id !== itemId);
        setSelectedItems(updatedSelectedItems);
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
            <div className='text-3xl font-bold text-center'>Tarkov Shopper</div>
            <div className=' flex w-full mt-4 gap-6'>
                <div className='w-1/3'>
                    <div className='card gap-2 card-bordered border-primary border-2'>
                        <div className='card-body items-center'>
                            <input
                                type='text'
                                placeholder='Search for an item...'
                                class='input input-bordered input-primary w-full max-w-xs'
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <ul className='flex flex-col gap-2 items-center'>
                                {displayedItems.map((item) => (
                                    <li className=''>
                                        <button
                                            class='btn btn-primary btn-outline text-lg h-auto'
                                            key={item.id}
                                            onClick={() => handleItemClick(item.id)}
                                        >
                                            {item.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Selected Items</h2>
                    <div style={{ marginBottom: '10px' }}>
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
                        <label for='save'>Clear Item Set:</label>
                        <br />
                        <button
                            className='btn btn-primary btn-outline text-lg'
                            onClick={handleClearSelectedItems}
                            style={{ marginTop: '10px' }}
                        >
                            Clear
                        </button>
                        <br />
                        <label for='save'>Save Current Item Set:</label>
                        <br />
                        <button class='btn btn-primary btn-outline text-lg' onClick={handleSaveSelectedItems}>
                            Save
                        </button>
                        <br />
                        <br />
                        <button class='btn btn-primary btn-outline text-lg' onClick={handleSortAlphabetically}>
                            Sort A-Z
                        </button>
                        <button class='btn btn-primary btn-outline text-lg' onClick={handleSortReverseAlphabetically}>
                            Sort Z-A
                        </button>
                        <button class='btn btn-primary btn-outline text-lg' onClick={handleSortByTotalQuantity}>
                            Sort by Highest Quantity
                        </button>
                        <button class='btn btn-primary btn-outline text-lg' onClick={handleSortByReverseTotalQuantity}>
                            Sort by Lowest Quantity
                        </button>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedItems.map((selectedItem) => (
                            <li key={selectedItem.id} style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.name}
                                    style={{
                                        marginRight: '10px',
                                        marginLeft: '10px',
                                    }}
                                />
                                {selectedItem.name} - Quantity: {' '}
                                <input id="quantity"
                                    type="number"
                                    value={selectedItem.quantity}
                                    onChange={(e) => handleQuantityChange(selectedItem.id, parseInt(e.target.value))}
                                className="input input-bordered input-primary input-xs w-full max-w-xs" />
                                <button onClick={() => handleDecreaseQuantity(selectedItem.id)}>
                                    <img src='images/icon-minus.png' alt='-' />
                                </button>
                                <button onClick={() => handleIncreaseQuantity(selectedItem.id)}>
                                    <img src='images/icon-plus.png' alt='+' />
                                </button>{' '}
                                <button onClick={() => handleRemoveItem(selectedItem.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SearchableList;