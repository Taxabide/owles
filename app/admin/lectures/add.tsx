import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import AdminAddLecture from '../../../src/components/admin/AdminAddLecture';

export default function AdminAddLecturePage() {
  const params = useLocalSearchParams();
  const courseId = Number(params.courseId || 0);
  const courseName = String(params.courseName || '');
  return <AdminAddLecture courseId={courseId} courseName={courseName} />;
}


