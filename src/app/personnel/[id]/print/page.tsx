// src/app/personnel/[id]/print/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { personnelService, Employee, ServiceRecord, LeaveRequest, Training } from "@/lib/api/services";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Print201FilePage() {
  const params = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const id = Number(params.id);
        const [empData, serviceData, leaveData, trainingData] = await Promise.all([
          personnelService.getEmployee(id),
          personnelService.getServiceRecordsByEmployee(id),
          personnelService.getLeaveRequestsByEmployee(id),
          personnelService.getTrainingsByEmployee(id)
        ]);

        setEmployee(empData);
        setServiceRecords(serviceData);
        setLeaveHistory(Array.isArray(leaveData) ? leaveData : []);
        setTrainings(Array.isArray(trainingData) ? trainingData : []);
        
        // Auto-print after data is loaded
        setTimeout(() => {
            window.print();
        }, 500);

      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  if (isLoading || !employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const handlePrint = () => {
    const printContents = document.getElementById("print-area")?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open("", "_blank", "width=1200,height=1200");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Print 201 File</title>
          <style>
            @media print {
              @page { margin: 0.5in; size: A4; }
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
            .print-section { margin-bottom: 15px; }
            .print-section-title { font-size: 10pt; font-weight: bold; background: #e0e0e0; padding: 4px 8px; border: 1px solid #000; border-bottom: none; text-transform: uppercase; }
            .print-table { width: 100%; border-collapse: collapse; font-size: 9pt; }
            .print-table th, .print-table td { border: 1px solid #000; padding: 4px 6px; vertical-align: top; }
            .print-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
            .label-cell { background-color: #f8f8f8; font-weight: bold; width: 18%; }
            .value-cell { width: 32%; }
            .page-break { page-break-before: always; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
            .signature-box { width: 40%; text-align: center; }
            .signature-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 5px; font-weight: bold; font-size: 10pt; }
        
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };


  return (
    <div id="print-area" className="p-8 max-w-[210mm] mx-auto bg-white text-black">
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
        
        .print-section {
            margin-bottom: 15px;
        }

        .print-section-title {
            font-size: 10pt;
            font-weight: bold;
            background: #e0e0e0;
            padding: 4px 8px;
            border: 1px solid #000;
            border-bottom: none;
            text-transform: uppercase;
        }

        .print-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9pt;
        }

        .print-table th,
        .print-table td {
            border: 1px solid #000;
            padding: 4px 6px;
            vertical-align: top;
        }

        .print-table th {
            background: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }

        .label-cell {
            background-color: #f8f8f8;
            font-weight: bold;
            width: 18%;
        }
        
        .value-cell {
            width: 32%;
        }

        .page-break {
            page-break-before: always;
        }

        .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            page-break-inside: avoid;
        }
        
        .signature-box {
            width: 40%;
            text-align: center;
        }
        
        .signature-line {
            border-top: 1px solid #000;
            margin-top: 30px;
            padding-top: 5px;
            font-weight: bold;
            font-size: 10pt;
        }
      `}</style>

      {/* Header */}
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden"
        style={{ position: "fixed", top: 24, right: 24, zIndex: 1000 }}
        type="button"
      >
        Print
      </button>
      <div className="text-center mb-8">
          <h2 className="text-[11pt] font-normal m-0">Republic of the Philippines</h2>
          <h2 className="text-[11pt] font-normal m-0">Department of Education</h2>
          <h2 className="text-[11pt] font-normal m-0">Region ___</h2>
          <h2 className="text-[11pt] font-normal m-0">Division of ___</h2>
          <h1 className="text-[16pt] font-bold mt-2 m-0">EMPLOYEE 201 FILE SUMMARY</h1>
      </div>

      {/* I. PERSONAL INFORMATION */}
      <div className="print-section">
          <div className="print-section-title">I. Personal Information</div>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">SURNAME</td>
                <td className="value-cell">{employee.last_name}</td>
                <td className="label-cell">FIRST NAME</td>
                <td className="value-cell">{employee.first_name}</td>
              </tr>
              <tr>
                <td className="label-cell">MIDDLE NAME</td>
                <td className="value-cell">{employee.middle_name || "N/A"}</td>
                <td className="label-cell">NAME EXTENSION</td>
                <td className="value-cell">{employee.suffix || "N/A"}</td>
              </tr>
              <tr>
                <td className="label-cell">DATE OF BIRTH</td>
                <td className="value-cell">{formatDate(employee.date_of_birth)}</td>
                <td className="label-cell">SEX</td>
                <td className="value-cell">{employee.gender}</td>
              </tr>
              <tr>
                <td className="label-cell">CIVIL STATUS</td>
                <td className="value-cell">{employee.civil_status}</td>
                <td className="label-cell">MOBILE NO.</td>
                <td className="value-cell">{employee.mobile_number}</td>
              </tr>
              <tr>
                <td className="label-cell">EMAIL ADDRESS</td>
                <td colSpan={3}>{employee.email}</td>
              </tr>
              <tr>
                <td className="label-cell">ADDRESS</td>
                <td colSpan={3}>
                  {employee.address}
                  {employee.city && `, ${employee.city}`}
                  {employee.province && `, ${employee.province}`}
                  {employee.zip_code && ` ${employee.zip_code}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* II. EMPLOYMENT INFORMATION */}
        <div className="print-section">
          <div className="print-section-title">II. Employment Details</div>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">EMPLOYEE NO.</td>
                <td className="value-cell">{employee.employee_number}</td>
                <td className="label-cell">PLANTILLA ITEM</td>
                <td className="value-cell">{employee.plantilla_item_no || "N/A"}</td>
              </tr>
              <tr>
                <td className="label-cell">POSITION</td>
                <td className="value-cell">{employee.position}</td>
                <td className="label-cell">POSITION TITLE</td>
                <td className="value-cell">{employee.position_title || "N/A"}</td>
              </tr>
              <tr>
                <td className="label-cell">DEPARTMENT</td>
                <td className="value-cell">{employee.department}</td>
                <td className="label-cell">STATUS</td>
                <td className="value-cell">{employee.employment_status}</td>
              </tr>
              <tr>
                <td className="label-cell">DATE HIRED</td>
                <td className="value-cell">{formatDate(employee.date_hired)}</td>
                <td className="label-cell">DATE SEPARATED</td>
                <td className="value-cell">{employee.date_separated ? formatDate(employee.date_separated) : "N/A"}</td>
              </tr>
              <tr>
                <td className="label-cell">SALARY GRADE</td>
                <td className="value-cell">{employee.salary_grade}</td>
                <td className="label-cell">STEP</td>
                <td className="value-cell">{employee.step_increment}</td>
              </tr>
              <tr>
                <td className="label-cell">MONTHLY SALARY</td>
                <td colSpan={3}>₱{employee.monthly_salary.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* III. GOVERNMENT ISSUED IDs */}
        <div className="print-section">
          <div className="print-section-title">III. Government ID Numbers</div>
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell">TIN</td>
                <td className="value-cell">{employee.tin || "N/A"}</td>
                <td className="label-cell">GSIS NO.</td>
                <td className="value-cell">{employee.gsis_number || "N/A"}</td>
              </tr>
              <tr>
                <td className="label-cell">PHILHEALTH NO.</td>
                <td className="value-cell">{employee.philhealth_number || "N/A"}</td>
                <td className="label-cell">PAG-IBIG NO.</td>
                <td className="value-cell">{employee.pagibig_number || "N/A"}</td>
              </tr>
              <tr>
                <td className="label-cell">SSS NO.</td>
                <td colSpan={3}>{employee.sss_number || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* IV. SERVICE RECORD */}
        <div className="print-section">
          <div className="print-section-title">IV. Service Record</div>
          {serviceRecords.length > 0 ? (
            <table className="print-table">
              <thead>
                <tr>
                  <th style={{width: '12%'}}>FROM</th>
                  <th style={{width: '12%'}}>TO</th>
                  <th>DESIGNATION</th>
                  <th>STATION/OFFICE</th>
                  <th style={{width: '12%'}}>SALARY</th>
                  <th style={{width: '5%'}}>SG</th>
                  <th style={{width: '5%'}}>STEP</th>
                </tr>
              </thead>
              <tbody>
                {serviceRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={{textAlign: 'center'}}>{formatDate(record.from_date)}</td>
                    <td style={{textAlign: 'center'}}>{record.to_date ? formatDate(record.to_date) : "Present"}</td>
                    <td>{record.position}</td>
                    <td>{record.department}</td>
                    <td style={{textAlign: 'right'}}>₱{record.monthly_salary.toLocaleString()}</td>
                    <td style={{textAlign: 'center'}}>{record.salary_grade}</td>
                    <td style={{textAlign: 'center'}}>{record.step_increment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '9pt'}}>No service records found</div>
          )}
        </div>

        {/* V. LEAVE RECORD */}
        <div className="print-section page-break">
          <div className="print-section-title">V. Leave Records</div>
          <table className="print-table" style={{marginBottom: '10px'}}>
            <tbody>
              <tr>
                <td className="label-cell" style={{width: '25%'}}>VACATION LEAVE CREDITS</td>
                <td className="value-cell" style={{width: '25%'}}>{employee.vacation_leave_credits}</td>
                <td className="label-cell" style={{width: '25%'}}>SICK LEAVE CREDITS</td>
                <td className="value-cell" style={{width: '25%'}}>{employee.sick_leave_credits}</td>
              </tr>
            </tbody>
          </table>
          {leaveHistory.length > 0 ? (
            <table className="print-table">
              <thead>
                <tr>
                  <th>LEAVE TYPE</th>
                  <th style={{width: '15%'}}>START DATE</th>
                  <th style={{width: '15%'}}>END DATE</th>
                  <th style={{width: '10%'}}>DAYS</th>
                  <th style={{width: '15%'}}>STATUS</th>
                  <th>REASON</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.leave_type}</td>
                    <td style={{textAlign: 'center'}}>{formatDate(leave.start_date)}</td>
                    <td style={{textAlign: 'center'}}>{formatDate(leave.end_date)}</td>
                    <td style={{textAlign: 'center'}}>{leave.working_days}</td>
                    <td style={{textAlign: 'center'}}>{leave.status}</td>
                    <td>{leave.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '9pt'}}>No leave history found</div>
          )}
        </div>

        {/* VI. LEARNING AND DEVELOPMENT */}
        <div className="print-section">
          <div className="print-section-title">VI. Learning and Development (L&D)</div>
          {trainings.length > 0 ? (
            <table className="print-table">
              <thead>
                <tr>
                  <th>TITLE OF TRAINING</th>
                  <th>TYPE</th>
                  <th>ORGANIZER</th>
                  <th style={{width: '12%'}}>FROM</th>
                  <th style={{width: '12%'}}>TO</th>
                  <th style={{width: '8%'}}>HOURS</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training) => (
                  <tr key={training.id}>
                    <td>{training.training_title}</td>
                    <td>{training.training_type}</td>
                    <td>{training.organizer}</td>
                    <td style={{textAlign: 'center'}}>{formatDate(training.start_date)}</td>
                    <td style={{textAlign: 'center'}}>{formatDate(training.end_date)}</td>
                    <td style={{textAlign: 'center'}}>{training.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '9pt'}}>No training records found</div>
          )}
        </div>

        {/* Footer */}
        <div className="signature-section">
          <div className="signature-box">
            <p style={{fontSize: '9pt', marginBottom: '30px'}}>Prepared by:</p>
            <div className="signature-line">HR OFFICER</div>
          </div>
          <div className="signature-box">
            <p style={{fontSize: '9pt', marginBottom: '30px'}}>Certified Correct:</p>
            <div className="signature-line">HEAD OF OFFICE</div>
          </div>
        </div>

        <div style={{marginTop: '20px', fontSize: '8pt', textAlign: 'center', color: '#666'}}>
          <p>System Generated Report | Date Printed: {new Date().toLocaleDateString()}</p>
        </div>
    </div>
  );
}
