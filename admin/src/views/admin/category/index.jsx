import {
  FormControl,
  Input,
  FormLabel,
  Select,
  InputGroup,
  InputRightElement,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { AiFillDelete, AiOutlineDown, AiOutlineHolder } from "react-icons/ai";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import CategoryList from "./CategoryList";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { storeCategory } from "api/category";
import { setLoading } from "reducers/isLoading";
import { storeSubCategory } from "api/category";
import { storeOption } from "api/category";
import Pagination from "layouts/pagination";
import { deleteCategory } from "api/category";
import { getCategory } from "api/category";
import { setCategory } from "reducers/category";
import Swal from "sweetalert2";
import { setChange } from "reducers/change";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { putApi } from "api/api";
import { url } from "api/authApi";

export default function Category() {
  const [page, setPage] = useState(0);
  const [categoryId, setCategoryId] = useState();
  const [name, setName] = useState();
  const [icon, setIcon] = useState();
  const [subCategory, setSubCategory] = useState();
  const [subCategoryName, setSubCategoryName] = useState();
  const [option, setOption] = useState();
  const [optionName, setOptionName] = useState();
  const categoryList = useSelector((state) => state.category);
  const subCategoryList = useSelector((state) => state.subCategory);
  const [subCategories, setSubCategories] = useState();
  const user = useSelector((state) => state.user);
  const [Category, setCategories] = useState();
  const [search, setSearch] = useState();
  const isLoading = useSelector((state) => state.isLoading);

  const alert = useAlert();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editCategoryId,setEditCategoryId]=useState()
  const [editCategoryName,setEditCategoryName]=useState()
  const [editCategoryIcon,setEditCategoryIcon]=useState()
  const [editCategoryIconVal,setEditCategoryIconVal]=useState()

  useEffect(() => {
    if (search) {
      return setCategories(
        categoryList.filter((d) =>
          d.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    setCategories(categoryList);
  }, [search, isLoading, categoryList]);

  const addMainCategory = async () => {
    if (!name || !icon) {
      return alert.info("All fields are required");
    }
    dispatch(setLoading(true));
    const f = new FormData();
    f.append("name", name);
    f.append("icon", icon);
    try {
      const res = await storeCategory(f, user?.token);
      dispatch(setLoading(false));
      dispatch(setChange(res));
      alert.success("Category added");
      setName("");
      setIcon();
    } catch (e) {
      dispatch(setLoading(false));
      alert.error("Something went wrong!");
    }
  };
  const editMainCategory = async () => {
    onClose()
    if (!editCategoryName ||!editCategoryId) {
      return alert.info("All fields are required");
    }
    dispatch(setLoading(true));
    const f = new FormData();
    f.append("name", editCategoryName);
    f.append("icon", editCategoryIcon);
    f.append("id", editCategoryId);
    try {
      const res = await putApi("/category/editCategory",f, user?.token);
      dispatch(setLoading(false));
      dispatch(setChange(res));
      alert.success("Category updated");
      setName("");
      setIcon();
    } catch (e) {
      dispatch(setLoading(false));
      alert.error("Something went wrong!");
    }
  };
  const addSubCategory = async () => {
    if (!subCategory || !subCategoryName || !user) {
      return alert.info("All fields are required");
    }
    dispatch(setLoading(true));
    try {
      const res = await storeSubCategory(
        subCategoryName,
        subCategory,
        user.token
      );
      dispatch(setLoading(false));
      dispatch(setChange(res));
      alert.success("Category added");
      setSubCategoryName("");
      setSubCategory("");
    } catch (e) {
      dispatch(setLoading(false));
      alert.error("Something went wrong!");
    }
  };
  const addOptions = async () => {
    if (!option || !optionName) {
      return alert.info("All fields are required");
    }
    dispatch(setLoading(true));
    try {
      const res = await storeOption(optionName, option, user?.token);
      dispatch(setLoading(false));
      dispatch(setChange(res));
      alert.success("Category added");
      setOptionName("");
      setOption("");
    } catch (e) {
      dispatch(setLoading(false));
      alert.error("Something went wrong!");
    }
  };
  const deleteItem = async (id) => {
    dispatch(setLoading(true));
    try {
      const res = await deleteCategory(id, user.token);
      //const res = await getCategory();
      //dispatch(setCategory(res.data));
      dispatch(setLoading(false));
      dispatch(setChange(res));
      alert.success("Category deleted");
    } catch (e) {
      alert.error("This category is using!");
      dispatch(setLoading(false));
    }
  };
  if (categoryId) {
    return <CategoryList id={categoryId} onBack={setCategoryId} />;
  }
  return (
    <div className="mt-4 gap-2 py-3 dark:text-[#fff] lg:grid lg:grid-cols-2">
      <div>
        <div className=" rounded-md border-2 p-4">
          <h1 className="headLine">Add Main Category</h1>
          <FormControl className="my-6">
            <FormLabel>Category Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={style}
              placeholder="Category Name"
            />
            <FormLabel className="mt-4">Category Icon</FormLabel>
            <Input
              onChange={(e) =>
                setIcon(e.target.files[e.target.files.length - 1])
              }
              type="file"
              style={style}
            />
            <Button
              onClick={addMainCategory}
              className="mt-4"
              colorScheme="blue"
            >
              Save
            </Button>
          </FormControl>
        </div>
        <div className=" mt-2 rounded-md border-2 p-4">
          <h1 className="headLine">Add Sub Category</h1>
          <FormControl className="my-6">
            <FormLabel>Select Category</FormLabel>
            <Select
              className=" dark:bg-brandLinear dark:text-[#000]"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              style={style}
              placeholder="Select Category"
            >
              {categoryList?.map((doc, i) => (
                <option key={i} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </Select>
            <FormLabel className="mt-4">Sub Category Name</FormLabel>
            <Input
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              placeholder="Sub Category Name"
              type="text"
              style={style}
            />
            <Button
              onClick={addSubCategory}
              className="mt-4"
              colorScheme="blue"
            >
              Save
            </Button>
          </FormControl>
        </div>
        <div className=" mt-2 rounded-md border-2 p-4">
          <h1 className="headLine">Add Options</h1>
          <FormControl className="my-6">
            <FormLabel>Select Category</FormLabel>
            <Select
              className=" dark:bg-brandLinear dark:text-[#000]"
              onChange={(e) => {
                setSubCategories(
                  subCategoryList?.filter((d) => d.categoryId == e.target.value)
                );
              }}
              style={style}
              placeholder="Select Category"
            >
              {categoryList?.map((doc, i) => (
                <option key={i} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </Select>
            <FormLabel className="mt-4">Select Sub Category</FormLabel>
            <Select
              className=" dark:bg-brandLinear dark:text-[#000]"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              style={style}
              placeholder="Select Sub-Category"
            >
              {subCategories?.map((doc, i) => (
                <option key={i} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </Select>
            <FormLabel className="mt-4">Option Name</FormLabel>
            <Input
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              placeholder="Option Name"
              type="text"
              style={style}
            />
            <Button onClick={addOptions} className="mt-4" colorScheme="blue">
              Save
            </Button>
          </FormControl>
        </div>
      </div>
      <div className=" mt-2 overflow-y-auto rounded-md border-2 p-4 lg:mt-0">
        <h1 className="headLine">Category List</h1>
        <InputGroup className="mt-4" style={style}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />
          <InputRightElement>
            <FaSearch />
          </InputRightElement>
        </InputGroup>

        <Pagination
          itemsPerPage={12}
          data={Category}
          head={
            <Tr>
              <Th>No.</Th>
              <Th>Name</Th>
              <Th>Action</Th>
            </Tr>
          }
          ROW={(e) => (
            <Tr>
              <Td>{e.index + 1}</Td>
              <Td>{e.data.name}</Td>
              <Td className=" z-30">
                <Menu >
                  {({ isOpen }) => (
                    <>
                      <MenuButton isActive={isOpen} as={Button}>
                        <AiOutlineHolder />
                      </MenuButton>

                      <MenuList className=" dark:text-[#000] z-20">
                        <MenuItem className="z-20"
                          onClick={() => {
                            Swal.fire({
                              title: "Are you sure?",
                              text: "You won't be able to revert this!",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#3085d6",
                              cancelButtonColor: "#d33",
                              confirmButtonText: "Yes, delete it!",
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteItem(e.data.id);
                              }
                            });
                          }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem onClick={() => setCategoryId(e.data.id)}>
                          View Sub-Categories
                        </MenuItem>
                        <MenuItem onClick={() => {
                          setEditCategoryId(e.data.id);
                          setEditCategoryName(e.data.name);
                          setEditCategoryIconVal(e.data.icon);
                          onOpen()
                        }}>
                          Edit
                        </MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
              </Td>
            </Tr>
          )}
        />
      </div>
      <Modal isOpen={isOpen} onClose={()=>{
        onClose()
        setEditCategoryIcon()
        setEditCategoryName()
        setEditCategoryId()
        setEditCategoryIconVal()
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              style={style}
              placeholder="Category Name"
            />
            <FormLabel className="mt-4">Category Icon</FormLabel>
            <Input
              onChange={(e) =>
                setEditCategoryIcon(e.target.files[e.target.files.length - 1])
              }
              type="file"
              style={style}
            />
            <img alt="icon" className="w-8 h-8 mt-2" src={editCategoryIcon?URL.createObjectURL(editCategoryIcon):`${url}${editCategoryIconVal}`}></img>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={()=>{
               onClose()
               setEditCategoryIcon()
               setEditCategoryName()
               setEditCategoryId()
               setEditCategoryIconVal()
            }}>
              Close
            </Button>
            <Button onClick={editMainCategory} colorScheme={"blue"}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
const style = {
  borderColor: "#ABB2B9",
};