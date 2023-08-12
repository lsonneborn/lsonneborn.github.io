import { useState } from "react";

import BestBeforeAddItemForm from "../components/BestBeforeAddItemForm";
import BestBeforeEditItemForm from "../components/BestBeforeEditItemForm";
import PopupModal from "../components/PopupModal";
import NameFilter from "../components/NameFilter";
import InStockFilter from "../components/InStockFilter";
import CategoryFilter from "../components/CategoryFilter";

interface BestBeforeProps {
  jsonData: Item[];
}

const BestBefore = ({ jsonData }: BestBeforeProps) => {
  const [listData, setListData] = useState(jsonData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [initialDataForEdit, setInitialDataForEdit] = useState<Item>({
    _id: 0,
    name: "",
    bestBeforeDate: null,
    inStock: false,
    storeDays: 0,
    category: "food",
  });
  const [filteredItems, setFilteredItems] = useState(listData);
  const [nameFilter, setNameFilter] = useState("");
  const [inStockFilter, setinStockFilter] = useState<boolean | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");

  const today = new Date();

  const addItem = (newItem: Item) => {
    let updatedList = [...listData];
    updatedList = [
      ...updatedList,
      {
        _id: listData.length + 1,
        name: newItem.name,
        inStock: newItem.inStock,
        bestBeforeDate: newItem.bestBeforeDate,
        storeDays: newItem.storeDays,
        category: newItem.category,
      },
    ];
    setListData(updatedList);
    setFilteredItems(updatedList);
    resetFilters();
    setShowAddForm(false);
  };

  const editItem = (id: number, editedItem: Item) => {
    const itemIndex = listData.findIndex((item) => item._id === id);

    if (itemIndex !== -1) {
      const updatedList = [...listData];

      updatedList[itemIndex] = {
        ...updatedList[itemIndex],
        name: editedItem.name,
        inStock: editedItem.inStock,
        bestBeforeDate: editedItem.bestBeforeDate,
        category: editedItem.category,
      };

      setListData(updatedList);
      setFilteredItems(updatedList);
      resetFilters();

      const keyword = nameFilter.toLowerCase();
      if (keyword !== "") {
        const filteredResults = updatedList.filter((item) => {
          return item.name.toLowerCase().startsWith(keyword);
        });
        setFilteredItems(filteredResults);
      }
      setShowEditForm(false);
      setInitialDataForEdit({
        _id: 0,
        name: "",
        bestBeforeDate: null,
        inStock: false,
        storeDays: 0,
        category: "food",
      });
    }
  };

  const deleteItem = (deletedItem: Item) => {
    let updatedList = listData.filter(
      (item: Item) => item._id !== deletedItem._id
    );
    setListData([...updatedList]);
    setFilteredItems([...updatedList]);
    resetFilters();
    setShowEditForm(false);
  };

  const handleRowClick = (data: Item) => {
    setShowEditForm(true);
    setInitialDataForEdit(data);
  };

  const formatDate = (date: Date | string | null): string => {
    if (!date) {
      return "-";
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(dateObj);
  };

  const resetFilters = () => {
    setNameFilter("");
    setCategoryFilter("");
    setinStockFilter(null);
  };

  const handleNameChange = (keyword: string) => {
    setNameFilter(keyword);
    applyFilters(keyword, inStockFilter, categoryFilter);
  };

  const handleInStockChange = (inStock: boolean | null) => {
    setinStockFilter(inStock);
    applyFilters(nameFilter, inStock, categoryFilter);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    applyFilters(nameFilter, inStockFilter, category);
  };

  const applyFilters = (
    nameFilter: string,
    inStockFilter: boolean | null,
    categoryFilter: string
  ) => {
    const nameKeyword = nameFilter.toLowerCase();
    const filteredByName = listData.filter((item) => {
      return item.name.toLowerCase().includes(nameKeyword);
    });

    if (inStockFilter !== null && categoryFilter !== "") {
      const filteredByNameAndInStock = filteredByName.filter((item) => {
        return item.inStock === inStockFilter;
      });
      const filteredByAll = filteredByNameAndInStock.filter((item) => {
        return item.category.includes(categoryFilter);
      });
      setFilteredItems(filteredByAll);
    } else if (inStockFilter !== null && categoryFilter === "") {
      const filteredByNameAndInStock = filteredByName.filter((item) => {
        return item.inStock === inStockFilter;
      });
      setFilteredItems(filteredByNameAndInStock);
    } else if (inStockFilter === null && categoryFilter !== "") {
      const filteredByCategory = filteredByName.filter((item) => {
        return item.category.includes(categoryFilter);
      });
      setFilteredItems(filteredByCategory);
    } else {
      setFilteredItems(filteredByName);
    }
  };

  //   const printList = () => {
  //     console.log(listData);
  //   };

  //   const printFilteredList = () => {
  //     console.log(filteredItems);
  //   };

  return (
    <>
      <div className="list-container">
        <table>
          {/* <tr>
            <td>
              <button onClick={printList}>Print List</button>
            </td>
            <td>
              <button onClick={printFilteredList}>Print filtered List</button>
            </td>
          </tr> */}
          <tr>
            <td>
              <NameFilter input={nameFilter} onChange={handleNameChange} />
              <label>At home?</label>
              <InStockFilter
                value={inStockFilter}
                onChange={handleInStockChange}
              />
              <label>Category</label>
              <CategoryFilter
                value={categoryFilter}
                onChange={handleCategoryChange}
              />
            </td>
            <td>
              <button
                className="btn btn-primary addButton"
                onClick={() => setShowAddForm(true)}
              >
                +
              </button>
            </td>
          </tr>
        </table>

        <PopupModal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
          <BestBeforeAddItemForm addItem={addItem} />
        </PopupModal>

        <PopupModal
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
        >
          <BestBeforeEditItemForm
            initialData={initialDataForEdit}
            editItem={editItem}
            deleteItem={deleteItem}
          />
        </PopupModal>

        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Best before</th>
              <th scope="col">At home?</th>
              <th scope="col">Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((data, _key) => {
                return (
                  <tr
                    key={data["_id"]}
                    className={
                      data["bestBeforeDate"] === null
                        ? data["inStock"]
                          ? ""
                          : "table-warning"
                        : data["bestBeforeDate"] > today
                        ? data["inStock"]
                          ? ""
                          : "table-warning"
                        : "table-danger"
                    }
                    onClick={() => handleRowClick(data)}
                  >
                    <td>{data["name"]}</td>
                    <td>
                      {data["bestBeforeDate"] === null
                        ? "-"
                        : formatDate(data["bestBeforeDate"])}
                      {/* data["bestBeforeDate"]} */}
                    </td>
                    <td>{data["inStock"] ? "yes" : "no"}</td>
                    <td>{data["category"]}</td>
                  </tr>
                );
              })
            ) : (
              <div>No results</div>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BestBefore;
