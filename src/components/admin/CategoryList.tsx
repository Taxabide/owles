import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAsync } from "../../redux/slices/categorySlice";
import { RootState } from "../../redux/store";
import AdminNavbar from "./AdminNavbar";
import AdminSideBar from "./AdminSideBar";

const { width: screenWidth } = Dimensions.get("window");

type CategoryRow = {
  id: string;
  name: string;
  createdAt: string;
};

const columnWidths = {
  sno: 80,
  name: 280,
  createdAt: 200,
};

const totalTableWidth = columnWidths.sno + columnWidths.name + columnWidths.createdAt;

const CategoryList: React.FC = () => {
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => (s.categories as any).categories || []);
  const isLoading = useSelector((s: RootState) => (s as any).categories.isLoading);
  const error = useSelector((s: RootState) => (s as any).categories.error);

  const [searchQuery, setSearchQuery] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesAsync() as any);
  }, [dispatch]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  }, []);

  const filtered = useMemo(() => {
    const rows: CategoryRow[] = ((categories as any[]) || []).map((c: any) => ({
      id: String(c.c_id ?? c.id ?? c.slug ?? c.c_name),
      name: c.c_name ?? c.name ?? "",
      createdAt: c.c_created_at ?? c.created_at ?? "",
    }));
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(r => r.name.toLowerCase().includes(q) || r.createdAt.toLowerCase().includes(q));
  }, [categories, searchQuery]);

  const totalPages = Math.ceil((filtered.length || 0) / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filtered.slice(startIndex, startIndex + entriesPerPage);

  const handlePageChange = (p: number) => setCurrentPage(p);

  const toggleMenu = () => setIsMenuOpen(v => !v);

  return (
    <View style={styles.container}>
      <AdminNavbar adminName="Admin" onMenuPress={toggleMenu} isMenuOpen={isMenuOpen} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>CATEGORIES LIST</Text>

          <View style={styles.tableControls}>
            <View style={styles.entriesPerPageContainer}>
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
              <View style={styles.headerRow}>
                <View style={[styles.headerCell, { width: columnWidths.sno }]}>
                  <Text style={styles.headerText}>#</Text>
                </View>
                <View style={[styles.headerCell, { width: columnWidths.name }]}>
                  <Text style={styles.headerText}>CATEGORY NAME</Text>
                </View>
                <View style={[styles.headerCell, { width: columnWidths.createdAt }]}>
                  <Text style={styles.headerText}>CREATED AT</Text>
                </View>
              </View>

              {currentData.length === 0 ? (
                <View style={styles.row}>
                  <Text style={[styles.cell, { width: totalTableWidth, textAlign: 'center', color: 'black' }]}>No data available in table</Text>
                </View>
              ) : (
                <FlatList
                  data={currentData}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item, index }) => (
                    <View style={styles.row}>
                      <Text style={[styles.cell, styles.cellText, { width: columnWidths.sno }]}>{startIndex + index + 1}</Text>
                      <Text style={[styles.cell, styles.cellText, { width: columnWidths.name }]}>{item.name}</Text>
                      <Text style={[styles.cell, styles.cellText, { width: columnWidths.createdAt }]}>{item.createdAt}</Text>
                    </View>
                  )}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </ScrollView>

          {/* Pagination Footer */}
          <View style={styles.tableFooter}>
            <Text style={styles.entriesInfo}>
              Showing {filtered.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + currentData.length, filtered.length)} of {filtered.length} entries
            </Text>
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <Text style={styles.pageButtonText}>«</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <Text style={styles.pageButtonText}>‹</Text>
              </TouchableOpacity>
              {Array.from({ length: totalPages }).map((_, i) => i + 1).slice(
                Math.max(0, currentPage - 3),
                Math.max(0, currentPage - 3) + 5
              ).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.pageButton, currentPage === p && styles.activePageButton]}
                  onPress={() => handlePageChange(p)}
                >
                  <Text style={[styles.pageButtonText, currentPage === p && styles.activePageButtonText]}>{p}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                onPress={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageButtonText}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                onPress={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                <Text style={styles.pageButtonText}>»</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {isMenuOpen && (
        <AdminSideBar
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          slideAnim={new (require('react-native').Animated.Value)(-screenWidth)}
          adminName="Admin"
          adminEmail="admin@example.com"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 20 },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 15, textAlign: "center" },
  tableControls: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15, flexWrap: "wrap", gap: 10 },
  entriesPerPageContainer: { flexDirection: "row", alignItems: "center", gap: 5 },
  entriesPerPageText: { fontSize: 14, color: "#4A5568" },
  searchContainer: { flexDirection: "row", alignItems: "center", gap: 5 },
  searchIcon: { marginRight: 8 },
  searchInput: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12, minWidth: 150, fontSize: 14 },
  headerRow: { flexDirection: "row", backgroundColor: "#f9f9f9" },
  headerCell: { padding: 12, backgroundColor: "#e0e0e0", justifyContent: "center", alignItems: "center", flexDirection: "row" },
  headerText: { fontWeight: "bold", fontSize: 14, color: "black", textAlign: "center" },
  row: { flexDirection: "row" },
  cell: { padding: 12, justifyContent: "center", alignItems: "center", textAlign: "center" },
  cellText: { color: "black", textAlign: "center" },
  tableFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingHorizontal: 5 },
  entriesInfo: { fontSize: 14, color: '#4A5568' },
  pagination: { flexDirection: 'row', gap: 8 },
  pageButton: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginLeft: 5 },
  activePageButton: { backgroundColor: '#1f1787', borderColor: '#1f1787' },
  pageButtonText: { color: '#1f1787', fontWeight: 'bold' },
  activePageButtonText: { color: 'white' },
  disabledButton: { opacity: 0.5, backgroundColor: '#E2E8F0', borderColor: '#E2E8F0' },
});

export default CategoryList;


