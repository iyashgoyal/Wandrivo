import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, Inquiry } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { data: inquiries, isLoading: isLoadingInquiries } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
  });

  const { data: packages } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const getPackageTitle = (packageId: number | null) => {
    if (!packageId) return "General Inquiry";
    const pkg = packages?.find((p) => p.id === packageId);
    return pkg?.title || "Unknown Package";
  };

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
          <p className="text-gray-600">Manage your travel inquiries</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInquiries ? (
                <div className="h-[200px] flex items-center justify-center">
                  <p>Loading inquiries...</p>
                </div>
              ) : !inquiries?.length ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No inquiries found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Travel Dates</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell>
                          {new Date().toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getPackageTitle(inquiry.packageId || null)}
                        </TableCell>
                        <TableCell>{inquiry.travelDates || "Not specified"}</TableCell>
                        <TableCell>
                          {inquiry.budget ? `$${inquiry.budget}` : "Not specified"}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
