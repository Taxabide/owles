import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentsList } from "../../redux/slices/adminSlice";
import { RootState } from "../../redux/store";
import AdminNavbar from "./AdminNavbar";
import AdminSideBar from "./AdminSideBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface Student {
  id: string;
  name: string;
  fatherName: string;
  email: string;
  phone: string;
  gender: string;
  profile: string | null;
  dob: string;
  address: string;
  city: string;
  country: string;
  createdAt: string;
}

const dummyStudents: Student[] = [
  {
    id: '1',
    name: 'John Doe',
    fatherName: 'Robert Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    gender: 'Male',
    profile: null,
    dob: '2000-01-15',
    address: '123 Main Street',
    city: 'New York',
    country: 'USA',
    createdAt: '2023-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    fatherName: 'Michael Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    gender: 'Female',
    profile: null,
    dob: '2001-03-22',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    country: 'USA',
    createdAt: '2023-02-20T14:15:00Z',
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    fatherName: 'Mohammed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '+1234567892',
    gender: 'Male',
    profile: null,
    dob: '1999-07-10',
    address: '789 Pine Road',
    city: 'Chicago',
    country: 'USA',
    createdAt: '2023-03-10T09:45:00Z',
  },
];

const columnWidths = {
  sno: 80,
  name: 180,
  fatherName: 180,
  email: 200,
  phone: 150,
  gender: 100,
  profile: 100,
  dob: 150,
  address: 200,
  city: 120,
  country: 120,
  createdAt: 150,
  action: 140,
};

const calculateTotalTableWidth = () => {
  return Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
};

const totalTableWidth = calculateTotalTableWidth();

const StudentList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const students = useSelector((state: RootState) => state.admin.studentsList);
  const isLoading = useSelector((state: RootState) => state.admin.isLoading);
  const error = useSelector((state: RootState) => state.admin.error);
  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-screenWidth)); // Initialize slideAnim
  const [sortConfig, setSortConfig] = useState<{ key: keyof typeof dummyStudents[0] | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [entriesPerPageDropdownVisible, setEntriesPerPageDropdownVisible] = useState(false);

  const entriesPerPageOptions = useMemo(() => [5, 10, 50, 100], []);

  useEffect(() => {
    dispatch(fetchStudentsList() as any);
  }, [dispatch]);

  const filteredStudents = useMemo(() => {
    const dataToFilter = ((students as any) as Student[]) || dummyStudents;
    if (searchQuery.trim() === '') {
      return dataToFilter;
    } else {
      return dataToFilter.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.createdAt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  }, [searchQuery, students]);

  const sortedData = useMemo(() => {
    const sortableItems = [...filteredStudents];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * (sortConfig.direction === 'asc' ? 1 : -1);
        }
        return 0; // Fallback for other types or if values are not comparable
      });
    }
    return sortableItems;
  }, [filteredStudents, sortConfig]);

  const totalPages = Math.max(1, Math.ceil((sortedData?.length || 0) / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentData = (sortedData || []).slice(startIndex, endIndex);

  const handlePageChange = useCallback((pageNumber: number) => {
    // Clamp to valid range
    const clamped = Math.min(Math.max(1, pageNumber), totalPages);
    setCurrentPage(clamped);
  }, []);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  }, []);

  const handleEntriesPerPageChange = useCallback((num: number) => {
    setEntriesPerPage(num);
    setCurrentPage(1);
    setEntriesPerPageDropdownVisible(false);
  }, []);

  // If filters or data change and currentPage exceeds totalPages, clamp it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const handleSort = (key: keyof typeof dummyStudents[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleMenu = () => {
    console.log("toggleMenu called, current isMenuOpen:", isMenuOpen);
    if (isMenuOpen) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLogout = () => {
    console.log("Admin Logout");
    router.replace("/");
  };

  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.sno }]}>
        <Text style={styles.headerText}>#</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.name }]} onPress={() => handleSort('name')}>
        <Text style={styles.headerText}>
          NAME {" "}
          {sortConfig.key === 'name' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.fatherName }]} onPress={() => handleSort('fatherName')}>
        <Text style={styles.headerText}>
          FATHER'S NAME {" "}
          {sortConfig.key === 'fatherName' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.email }]} onPress={() => handleSort('email')}>
        <Text style={styles.headerText}>
          EMAIL {" "}
          {sortConfig.key === 'email' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.phone }]} onPress={() => handleSort('phone')}>
        <Text style={styles.headerText}>
          PHONE {" "}
          {sortConfig.key === 'phone' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.gender }]} onPress={() => handleSort('gender')}>
        <Text style={styles.headerText}>
          GENDER {" "}
          {sortConfig.key === 'gender' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <View style={[styles.headerCell, { width: columnWidths.profile }]}>
        <Text style={styles.headerText}>PROFILE</Text>
      </View>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.dob }]} onPress={() => handleSort('dob')}>
        <Text style={styles.headerText}>
          DOB {" "}
          {sortConfig.key === 'dob' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.address }]} onPress={() => handleSort('address')}>
        <Text style={styles.headerText}>
          ADDRESS {" "}
          {sortConfig.key === 'address' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.city }]} onPress={() => handleSort('city')}>
        <Text style={styles.headerText}>
          CITY {" "}
          {sortConfig.key === 'city' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.country }]} onPress={() => handleSort('country')}>
        <Text style={styles.headerText}>
          COUNTRY {" "}
          {sortConfig.key === 'country' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.headerCell, { width: columnWidths.createdAt }]} onPress={() => handleSort('createdAt')}>
        <Text style={styles.headerText}>
          CREATED AT {" "}
          {sortConfig.key === 'createdAt' && (
            <FontAwesome
              name={sortConfig.direction === 'asc' ? 'caret-up' : 'caret-down'}
              size={12}
              color="#495057"
            />
          )}
        </Text>
      </TouchableOpacity>
      <View style={[styles.headerCell, { width: columnWidths.action }]}>
        <Text style={styles.headerText}>ACTION</Text>
      </View>
    </View>
  );

  const renderTableRow = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.sno }]}>{startIndex + index + 1}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.name }]}>{item.name}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.fatherName }]}>{item.fatherName}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.email }]}>{item.email}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.phone }]}>{item.phone}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.gender }]}>{item.gender}</Text>
      <View style={[styles.cell, { width: columnWidths.profile }]}>
        {item.profile ? (
          <Text style={styles.cellText}>Image</Text>
        ) : (
          <View style={styles.noImageButton}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.dob }]}>{formatDate(item.dob)}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.address }]}>{item.address}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.city }]}>{item.city}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.country }]}>{item.country}</Text>
      <Text style={[styles.cell, styles.cellText, { width: columnWidths.createdAt }]}>{formatDate(item.createdAt)}</Text>
      <View style={[styles.cell, { width: columnWidths.action }]}>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => console.log("Edit", item.id)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPagination = () => {
    // Render ALL pages with wrapping. No scroll, no ellipses.
    const pages: number[] = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <View style={styles.tableFooter}>
        <View>
          <Text style={styles.entriesInfo}>
            Showing {sortedData.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + currentData.length, sortedData.length)} of {sortedData.length} entries
          </Text>
          <Text style={[styles.entriesInfo, { marginTop: 2 }]}>Page {currentPage} of {totalPages}</Text>
        </View>
        <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[styles.navBtn, currentPage === 1 && styles.navBtnDisabled]}
              onPress={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              activeOpacity={0.8}
            >
            <View style={styles.navBtnContent}> 
              <MaterialIcons name="chevron-left" size={16} color={currentPage === 1 ? '#9ca3af' : '#111827'} />
              <Text style={[styles.navBtnText, currentPage === 1 && styles.navBtnTextDisabled]}>Previous</Text>
            </View>
            </TouchableOpacity>

            {pages.map((p) => (
              <TouchableOpacity
                key={`p-${p}`}
                style={[styles.pageBox, currentPage === p && styles.pageBoxActive]}
                onPress={() => handlePageChange(p)}
                disabled={currentPage === p}
                activeOpacity={0.8}
              >
                <Text style={[styles.pageBoxText, currentPage === p && styles.pageBoxTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.navBtn, currentPage === totalPages && styles.navBtnDisabled]}
              onPress={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              activeOpacity={0.8}
            >
            <View style={styles.navBtnContent}> 
              <Text style={[styles.navBtnText, currentPage === totalPages && styles.navBtnTextDisabled]}>Next</Text>
              <MaterialIcons name="chevron-right" size={16} color={currentPage === totalPages ? '#9ca3af' : '#111827'} />
            </View>
            </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AdminNavbar
        adminName="John Doe"
        onMenuPress={toggleMenu}
        isMenuOpen={isMenuOpen}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>STUDENTS LIST</Text>

          <View style={styles.tableControls}>
            <View style={styles.entriesPerPageContainer}>
              <TouchableOpacity
                style={styles.entriesPerPageButton}
                onPress={() => setEntriesPerPageDropdownVisible(!entriesPerPageDropdownVisible)}
              >
                <Text style={styles.dropdownButtonText}>{entriesPerPage}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="black" />
              </TouchableOpacity>

              {entriesPerPageDropdownVisible && (
                <View style={styles.entriesPerPageDropdown}>
                  {entriesPerPageOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.entriesPerPageOption,
                        entriesPerPage === option && styles.entriesPerPageOptionSelected
                      ]}
                      onPress={() => handleEntriesPerPageChange(option)}
                    >
                      <Text style={styles.entriesPerPageOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <Text style={styles.entriesPerPageText}> entries per page</Text>
            </View>

            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                placeholder="Search:"
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
                style={styles.searchInput}
              />
            </View>
          </View>

          <ScrollView horizontal>
            <View style={{ width: totalTableWidth }}>
              {renderTableHeader()}
              {currentData.length === 0 ? (
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: totalTableWidth, textAlign: 'center', color: 'black' }]}>
                    No data available in table
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={currentData}
                  renderItem={renderTableRow}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false} // Managed by outer horizontal ScrollView
                />
              )}
            </View>
          </ScrollView>

          {renderPagination()}
        </View>
      </ScrollView>



      {/* Sidebar */}
      {isMenuOpen && (
        <AdminSideBar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          slideAnim={slideAnim}
          adminName="John Doe"
          adminEmail="admin@gmail.com"
        />
      )}

      {/* Overlay */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A202C",
    textAlign: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 10,
  },
  entriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  entriesText: {
    fontSize: 14,
    color: "#4A5568",
  },
  entriesInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 50,
    textAlign: "center",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 150,
    fontSize: 14,
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFF",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    padding: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  headerText: {
    fontWeight: "700",
    fontSize: 13,
    color: "#1F2937",
    textAlign: "center",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  cell: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  cellText: {
    color: "black",
    textAlign: "center",
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#10B981",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  noImageButton: {
    backgroundColor: "#E53E3E",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  noImageText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  noDataText: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 16,
    color: "#718096",
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  tableControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    flexWrap: "wrap",
    gap: 10,
  },
  entriesPerPageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  entriesPerPageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: "#4A5568",
    fontWeight: "600",
  },
  entriesPerPageDropdown: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 5,
    width: 100,
    zIndex: 1,
  },
  entriesPerPageOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  entriesPerPageOptionText: {
    fontSize: 14,
    color: "#4A5568",
  },
  entriesPerPageOptionSelected: {
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  entriesPerPageText: {
    fontSize: 14,
    color: "#4A5568",
  },
  searchIcon: {
    marginRight: 8,
  },
  tableFooter: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  entriesInfo: {
    fontSize: 14,
    color: "#4A5568",
    textAlign: 'center',
  },
  pagination: {
    flexDirection: "row",
    gap: 8,
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  navBtnDisabled: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  navBtnText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '700',
  },
  navBtnTextDisabled: {
    color: '#9ca3af',
  },
  navBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageBox: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  pageBoxActive: {
    backgroundColor: '#1f1787',
    borderColor: '#1f1787',
    transform: [{ scale: 1.02 }],
  },
  pageBoxText: {
    color: '#1f2937',
    fontSize: 12,
    fontWeight: '700',
  },
  pageBoxTextActive: {
    color: '#fff',
  },
  ellipsis: {
    marginHorizontal: 6,
    color: '#6b7280',
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginLeft: 5,
  },
  activePageButton: {
    backgroundColor: "#1f1787",
    borderColor: "#1f1787",
  },
  pageButtonText: {
    color: "#1f1787",
    fontWeight: "bold",
  },
  activePageButtonText: {
    color: "white",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "#E2E8F0",
    borderColor: "#E2E8F0",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
});

export default StudentList;
