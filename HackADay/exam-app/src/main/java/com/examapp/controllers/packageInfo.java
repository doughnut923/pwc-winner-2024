package com.examapp.controllers;
/**
 * <p>
 * This package stores APIs that the frontend interacts with.
 * Each controller corresponds to a table with the same name in SQL.
 * The <code>StatusController</code> is special as it corresponds to the
 * <code>examDashBoard</code> key in Redis.
 * </p>
 *
 * <h3>UserController</h3>
 * <ul>
 *   <li>Handles user status.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>login</li>
 *       <li>register</li>
 *       <li>retrieve student list with their corresponding classes (getStudentWithClasses)</li>
 *     </ol>
 *   </li>
 *   <li>Open to public:
 *     <ul>
 *       <li>login</li>
 *       <li>register (accessible without a token)</li>
 *     </ul>
 *   </li>
 *   <li>Available to teachers only:
 *     <ul>
 *       <li>getStudentWithClasses</li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * <h3>AuthorityController</h3>
 * <ul>
 *   <li>Handles information about student permissions for classes.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>get the student list of a class (getStudentList)</li>
 *       <li>assign students to classes (setAuthorities)</li>
 *     </ol>
 *   </li>
 *   <li>Available to teachers only:
 *     <ul>
 *       <li>getStudentList</li>
 *       <li>setAuthorities</li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * <h3>ExamController</h3>
 * <ul>
 *   <li>Handles information about exam lists and exam content.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>create or update exam info (update)</li>
 *       <li>getExamList</li>
 *       <li>getExamContent</li>
 *     </ol>
 *   </li>
 *   <li>Available to teachers only:
 *     <ul>
 *       <li>update</li>
 *       <li>getExamList: shows all exams to teachers while only permitted exams are shown to students.</li>
 *       <li>getExamContent: shows content to teachers at all times while masking content for students outside of allowed timing.</li>
 *     </ul>
 *   </li>
 * </ul>
 *
 * <h3>StatusController</h3>
 * <ul>
 *   <li>Handles temporary data concerning suspicious images generated during exams; data is stored temporarily in Redis.</li>
 *   <li>APIs available:
 *     <ol>
 *       <li>compare images sent by students with those in S3 and store the input image in S3 if suspicious (checkFaces)</li>
 *       <li>retrieve a list of suspicious images according to student username (getSuspiciousImageList)</li>
 *       <li>retrieve a list of students with suspicious images (getSuspiciousList)</li>
 *     </ol>
 *   </li>
 *   <li>Available to teachers only:
 *     <ul>
 *       <li>getSuspiciousImageList</li>
 *       <li>getSuspiciousList</li>
 *     </ul>
 *   </li>
 * </ul>
 */

public class packageInfo {
}
