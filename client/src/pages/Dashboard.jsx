import { useQuery } from 'react-query'
import { userAPI } from '../services/api'
import { 
  Users, 
  FileText, 
  Award, 
  TrendingUp,
  Calendar,
  Download
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery('dashboardStats', userAPI.getDashboardStats)

  if (isLoading) {
    return <LoadingSpinner size="xl" className="h-64" />
  }

  const statCards = [
    {
      name: 'Total Users',
      value: stats?.data?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Templates',
      value: stats?.data?.totalTemplates || 0,
      icon: FileText,
      color: 'bg-green-500'
    },
    {
      name: 'Certificates Issued',
      value: stats?.data?.totalCertificates || 0,
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      name: 'This Month',
      value: stats?.data?.certificatesByMonth?.slice(-1)[0]?.count || 0,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your certificate management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Certificates */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Certificates</h3>
        </div>
        <div className="card-body">
          {stats?.data?.recentCertificates?.length > 0 ? (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {stats.data.recentCertificates.map((certificate) => (
                  <li key={certificate._id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Award className="h-4 w-4 text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {certificate.recipientName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {certificate.templateId?.title}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {new Date(certificate.createdAt).toLocaleDateString()}
                        </span>
                        <button className="text-primary-600 hover:text-primary-900">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-6">
              <Award className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first certificate.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Create Template</h3>
                <p className="text-sm text-gray-500">
                  Design a new certificate template
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Generate Certificate</h3>
                <p className="text-sm text-gray-500">
                  Issue a new certificate
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">View Certificates</h3>
                <p className="text-sm text-gray-500">
                  Browse all issued certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
