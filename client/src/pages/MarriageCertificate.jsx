import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'
import { marriageAPI } from '../services/api'

const MarriageCertificate = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isEditing, setIsEditing] = useState(false)
  const [certificateId, setCertificateId] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [searchSerial, setSearchSerial] = useState('')
  const [printMode, setPrintMode] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch
  } = useForm()

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      loadCertificate(id)
    }
  }, [searchParams])

  const loadCertificate = async (id) => {
    try {
      const response = await marriageAPI.getCertificate(id)
      const data = response.data.data
      setIsEditing(true)
      setCertificateId(id)
      
      Object.keys(data).forEach(key => {
        if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'createdBy' && key !== 'updatedBy') {
          if (key === 'dateOfMarriage') {
            setValue(key, new Date(data[key]).toISOString().split('T')[0])
          } else {
            setValue(key, data[key])
          }
        }
      })
    } catch (error) {
      toast.error('Failed to load certificate')
    }
  }

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await marriageAPI.updateCertificate(certificateId, data)
        toast.success('Certificate updated successfully / प्रमाण पत्र सफलतापूर्वक अद्यतन किया गया')
      } else {
        await marriageAPI.createCertificate(data)
        toast.success('Certificate saved successfully / प्रमाण पत्र सफलतापूर्वक सहेजा गया')
        reset()
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save certificate'
      toast.error(`${message} / प्रमाण पत्र सहेजने में विफल`)
    }
  }

  const handleReset = () => {
    reset()
    setIsEditing(false)
    setCertificateId(null)
    setSearchParams({})
    toast.success('Form reset / फॉर्म रीसेट')
  }

  const handleSearch = async () => {
    try {
      const params = {}
      if (searchName) params.search = searchName
      if (searchSerial) params.search = searchSerial
      
      const response = await marriageAPI.getCertificates({ ...params, limit: 1 })
      
      if (response.data.data.length > 0) {
        const cert = response.data.data[0]
        loadCertificate(cert._id)
        toast.success('Certificate found / प्रमाण पत्र मिला')
      } else {
        toast.error('No certificate found / कोई प्रमाण पत्र नहीं मिला')
      }
    } catch (error) {
      toast.error('Search failed / खोज विफल')
    }
  }

  const handlePrint = () => {
    setPrintMode(true)
    setTimeout(() => {
      window.print()
      setPrintMode(false)
    }, 100)
  }

  if (printMode) {
    return (
      <div className="print-container p-8 bg-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">MARRIAGE CERTIFICATE / विवाह प्रमाण पत्र</h1>
          <h2 className="text-xl mb-1">ST. JOSEPH'S CATHEDRAL / सेंट जोसेफ कैथेड्रल</h2>
          <h3 className="text-lg">DIOCESE OF MEERUT / मेरठ धर्मप्रांत</h3>
        </div>
        <div className="space-y-4 text-sm">
          <p><strong>Serial No. / क्रमांक:</strong> {watch('serialNo') || ''}</p>
          <p><strong>Year / वर्ष:</strong> {watch('year') || ''}</p>
          <p><strong>Date of Marriage / विवाह की तिथि:</strong> {watch('dateOfMarriage') || ''}</p>
          <p><strong>Place of Marriage / विवाह का स्थान:</strong> {watch('placeOfMarriage') || ''}</p>
          <p><strong>Bridegroom's Name / वर का नाम:</strong> {watch('bridegroomsName') || ''}</p>
          <p><strong>Bridegroom's Father's Name / वर के पिता का नाम:</strong> {watch('bridegroomsFathersName') || ''}</p>
          <p><strong>Bride's Name / वधू का नाम:</strong> {watch('bridesName') || ''}</p>
          <p><strong>Bride's Father's Name / वधू के पिता का नाम:</strong> {watch('bridesFathersName') || ''}</p>
          <p><strong>Witness 1 / गवाह 1:</strong> {watch('witness1') || ''}</p>
          <p><strong>Witness 2 / गवाह 2:</strong> {watch('witness2') || ''}</p>
        </div>
        <div className="mt-12 flex justify-between">
          <div>
            <p><strong>Parochial Seal / पेरोकियल सील</strong></p>
          </div>
          <div className="text-right">
            <p><strong>Date / दिनांक:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Father-in-charge / प्रभारी फादर</strong></p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">MARRIAGE CERTIFICATE / विवाह प्रमाण पत्र</h1>
            <h2 className="text-xl mb-1 text-gray-700">ST. JOSEPH'S CATHEDRAL / सेंट जोसेफ कैथेड्रल</h2>
            <h3 className="text-lg text-gray-600">DIOCESE OF MEERUT / मेरठ धर्मप्रांत</h3>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Search Marriage Certificate / विवाह प्रमाण पत्र खोजें</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Groom or Bride Name / नाम से खोजें:
              </label>
              <Input
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Enter name / नाम दर्ज करें"
              />
            </div>
            <div>
              <label htmlFor="searchSerial" className="block text-sm font-medium text-gray-700 mb-2">
                Or by Serial No. / या क्रमांक:
              </label>
              <Input
                id="searchSerial"
                value={searchSerial}
                onChange={(e) => setSearchSerial(e.target.value)}
                placeholder="Enter serial number / क्रमांक दर्ज करें"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            className="mt-4"
            variant="primary"
          >
            Search / खोजें
          </Button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Serial No */}
            <div>
              <label htmlFor="serialNo" className="block text-sm font-medium text-gray-700 mb-2">
                Serial No. / क्रमांक: <span className="text-red-500">*</span>
              </label>
              <Input
                id="serialNo"
                {...register('serialNo', { required: 'Serial number is required / क्रमांक आवश्यक है' })}
                error={errors.serialNo?.message}
                placeholder="Enter serial number / क्रमांक दर्ज करें"
                className={errors.serialNo ? 'border-red-500' : ''}
              />
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year / वर्ष: <span className="text-red-500">*</span>
              </label>
              <Input
                id="year"
                {...register('year', { required: 'Year is required / वर्ष आवश्यक है' })}
                error={errors.year?.message}
                placeholder="Enter year / वर्ष दर्ज करें"
                className={errors.year ? 'border-red-500' : ''}
              />
            </div>

            {/* Date of Marriage */}
            <div>
              <label htmlFor="dateOfMarriage" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Marriage / विवाह की तिथि: <span className="text-red-500">*</span>
              </label>
              <Input
                id="dateOfMarriage"
                type="date"
                {...register('dateOfMarriage', { required: 'Date of marriage is required / विवाह की तिथि आवश्यक है' })}
                error={errors.dateOfMarriage?.message}
                className={errors.dateOfMarriage ? 'border-red-500' : ''}
              />
            </div>

            {/* Place of Marriage */}
            <div>
              <label htmlFor="placeOfMarriage" className="block text-sm font-medium text-gray-700 mb-2">
                Place of Marriage / विवाह का स्थान: <span className="text-red-500">*</span>
              </label>
              <Input
                id="placeOfMarriage"
                {...register('placeOfMarriage', { required: 'Place of marriage is required / विवाह का स्थान आवश्यक है' })}
                error={errors.placeOfMarriage?.message}
                placeholder="Enter place of marriage / विवाह का स्थान दर्ज करें"
                className={errors.placeOfMarriage ? 'border-red-500' : ''}
              />
            </div>

            {/* Bridegroom's Name */}
            <div>
              <label htmlFor="bridegroomsName" className="block text-sm font-medium text-gray-700 mb-2">
                Bridegroom's Name / वर का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="bridegroomsName"
                {...register('bridegroomsName', { required: "Bridegroom's name is required / वर का नाम आवश्यक है" })}
                error={errors.bridegroomsName?.message}
                placeholder="Enter bridegroom's name / वर का नाम दर्ज करें"
                className={errors.bridegroomsName ? 'border-red-500' : ''}
              />
            </div>

            {/* Bridegroom's Father's Name */}
            <div>
              <label htmlFor="bridegroomsFathersName" className="block text-sm font-medium text-gray-700 mb-2">
                Bridegroom's Father's Name / वर के पिता का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="bridegroomsFathersName"
                {...register('bridegroomsFathersName', { required: "Bridegroom's father's name is required / वर के पिता का नाम आवश्यक है" })}
                error={errors.bridegroomsFathersName?.message}
                placeholder="Enter father's name / पिता का नाम दर्ज करें"
                className={errors.bridegroomsFathersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Bride's Name */}
            <div>
              <label htmlFor="bridesName" className="block text-sm font-medium text-gray-700 mb-2">
                Bride's Name / वधू का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="bridesName"
                {...register('bridesName', { required: "Bride's name is required / वधू का नाम आवश्यक है" })}
                error={errors.bridesName?.message}
                placeholder="Enter bride's name / वधू का नाम दर्ज करें"
                className={errors.bridesName ? 'border-red-500' : ''}
              />
            </div>

            {/* Bride's Father's Name */}
            <div>
              <label htmlFor="bridesFathersName" className="block text-sm font-medium text-gray-700 mb-2">
                Bride's Father's Name / वधू के पिता का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="bridesFathersName"
                {...register('bridesFathersName', { required: "Bride's father's name is required / वधू के पिता का नाम आवश्यक है" })}
                error={errors.bridesFathersName?.message}
                placeholder="Enter father's name / पिता का नाम दर्ज करें"
                className={errors.bridesFathersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Witness 1 */}
            <div>
              <label htmlFor="witness1" className="block text-sm font-medium text-gray-700 mb-2">
                Witness 1 / गवाह 1: <span className="text-red-500">*</span>
              </label>
              <Input
                id="witness1"
                {...register('witness1', { required: 'Witness 1 is required / गवाह 1 आवश्यक है' })}
                error={errors.witness1?.message}
                placeholder="Enter witness 1 name / गवाह 1 का नाम दर्ज करें"
                className={errors.witness1 ? 'border-red-500' : ''}
              />
            </div>

            {/* Witness 2 */}
            <div>
              <label htmlFor="witness2" className="block text-sm font-medium text-gray-700 mb-2">
                Witness 2 / गवाह 2: <span className="text-red-500">*</span>
              </label>
              <Input
                id="witness2"
                {...register('witness2', { required: 'Witness 2 is required / गवाह 2 आवश्यक है' })}
                error={errors.witness2?.message}
                placeholder="Enter witness 2 name / गवाह 2 का नाम दर्ज करें"
                className={errors.witness2 ? 'border-red-500' : ''}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
            >
              Reset / रीसेट
            </Button>
            <Button
              type="button"
              onClick={handlePrint}
              variant="secondary"
              className="hover:shadow-md transition-all duration-200"
            >
              Print / प्रिंट
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              className="hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              {isEditing ? 'Update / अपडेट' : 'Save / सहेजें'}
            </Button>
          </div>
        </form>

        {/* Footer Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Parochial Seal / पेरोकियल सील</p>
            </div>
            <div className="text-right mt-4 md:mt-0">
              <p className="text-sm font-medium text-gray-700">Date / दिनांक: {new Date().toLocaleDateString()}</p>
              <p className="text-sm font-medium text-gray-700 mt-2">Father-in-charge / प्रभारी फादर</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarriageCertificate

