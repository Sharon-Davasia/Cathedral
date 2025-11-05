import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Input from '../components/Input'
import Button from '../components/Button'
import Select from '../components/Select'
import { baptismAPI } from '../services/api'

const BaptismCertificate = () => {
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

  // Load certificate if editing
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      loadCertificate(id)
    }
  }, [searchParams])

  const loadCertificate = async (id) => {
    try {
      const response = await baptismAPI.getCertificate(id)
      const data = response.data.data
      setIsEditing(true)
      setCertificateId(id)
      
      // Set form values
      Object.keys(data).forEach(key => {
        if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'createdBy' && key !== 'updatedBy') {
          if (key === 'dateOfBaptism' || key === 'dateOfBirth') {
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
        await baptismAPI.updateCertificate(certificateId, data)
        toast.success('Certificate updated successfully / प्रमाण पत्र सफलतापूर्वक अद्यतन किया गया')
      } else {
        await baptismAPI.createCertificate(data)
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
      
      const response = await baptismAPI.getCertificates({ ...params, limit: 1 })
      
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
          <h1 className="text-3xl font-bold mb-2">BAPTISM CERTIFICATE / बपतिस्मा प्रमाण पत्र</h1>
          <h2 className="text-xl mb-1">ST. JOSEPH'S CATHEDRAL / सेंट जोसेफ कैथेड्रल</h2>
          <h3 className="text-lg">DIOCESE OF MEERUT / मेरठ धर्मप्रांत</h3>
        </div>
        <div className="space-y-4 text-sm">
          <p><strong>Serial No. / क्रमांक:</strong> {watch('serialNo') || ''}</p>
          <p><strong>Year / वर्ष:</strong> {watch('year') || ''}</p>
          <p><strong>Date of Baptism / बपतिस्मा की तिथि:</strong> {watch('dateOfBaptism') || ''}</p>
          <p><strong>Date of Birth / जन्म तिथि:</strong> {watch('dateOfBirth') || ''}</p>
          <p><strong>Place of Birth / जन्म स्थान:</strong> {watch('placeOfBirth') || ''}</p>
          <p><strong>Name / नाम:</strong> {watch('name') || ''}</p>
          <p><strong>Sex / लिंग:</strong> {watch('sex') || ''}</p>
          <p><strong>Father's Name / पिता का नाम:</strong> {watch('fathersName') || ''}</p>
          <p><strong>Mother's Name / माता का नाम:</strong> {watch('mothersName') || ''}</p>
          <p><strong>Father's Domicile / पिता का निवास:</strong> {watch('fathersDomicile') || ''}</p>
          <p><strong>His Profession / उनका व्यवसाय:</strong> {watch('fathersProfession') || ''}</p>
          <p><strong>Godfather's Name / गॉडफादर का नाम:</strong> {watch('godfathersName') || ''}</p>
          <p><strong>Godmother's Name / गॉडमदर का नाम:</strong> {watch('godmothersName') || ''}</p>
          <p><strong>Minister's Name / मंत्री का नाम:</strong> {watch('ministersName') || ''}</p>
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
            <h1 className="text-3xl font-bold mb-2 text-gray-900">BAPTISM CERTIFICATE / बपतिस्मा प्रमाण पत्र</h1>
            <h2 className="text-xl mb-1 text-gray-700">ST. JOSEPH'S CATHEDRAL / सेंट जोसेफ कैथेड्रल</h2>
            <h3 className="text-lg text-gray-600">DIOCESE OF MEERUT / मेरठ धर्मप्रांत</h3>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Search Baptism Certificate / बपतिस्मा प्रमाण पत्र खोजें</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name / नाम से खोजें:
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

            {/* Date of Baptism */}
            <div>
              <label htmlFor="dateOfBaptism" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Baptism / बपतिस्मा की तिथि: <span className="text-red-500">*</span>
              </label>
              <Input
                id="dateOfBaptism"
                type="date"
                {...register('dateOfBaptism', { required: 'Date of baptism is required / बपतिस्मा की तिथि आवश्यक है' })}
                error={errors.dateOfBaptism?.message}
                className={errors.dateOfBaptism ? 'border-red-500' : ''}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth / जन्म तिथि: <span className="text-red-500">*</span>
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth', { required: 'Date of birth is required / जन्म तिथि आवश्यक है' })}
                error={errors.dateOfBirth?.message}
                className={errors.dateOfBirth ? 'border-red-500' : ''}
              />
            </div>

            {/* Place of Birth */}
            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Place of Birth / जन्म स्थान: <span className="text-red-500">*</span>
              </label>
              <Input
                id="placeOfBirth"
                {...register('placeOfBirth', { required: 'Place of birth is required / जन्म स्थान आवश्यक है' })}
                error={errors.placeOfBirth?.message}
                placeholder="Enter place of birth / जन्म स्थान दर्ज करें"
                className={errors.placeOfBirth ? 'border-red-500' : ''}
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name / नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required / नाम आवश्यक है' })}
                error={errors.name?.message}
                placeholder="Enter name / नाम दर्ज करें"
                className={errors.name ? 'border-red-500' : ''}
              />
            </div>

            {/* Sex */}
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700 mb-2">
                Sex / लिंग: <span className="text-red-500">*</span>
              </label>
              <Select
                id="sex"
                {...register('sex', { required: 'Sex is required / लिंग आवश्यक है' })}
                error={errors.sex?.message}
                className={errors.sex ? 'border-red-500' : ''}
              >
                <option value="">Select / चुनें</option>
                <option value="Male">Male / पुरुष</option>
                <option value="Female">Female / महिला</option>
              </Select>
            </div>

            {/* Father's Name */}
            <div>
              <label htmlFor="fathersName" className="block text-sm font-medium text-gray-700 mb-2">
                Father's Name / पिता का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="fathersName"
                {...register('fathersName', { required: "Father's name is required / पिता का नाम आवश्यक है" })}
                error={errors.fathersName?.message}
                placeholder="Enter father's name / पिता का नाम दर्ज करें"
                className={errors.fathersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Mother's Name */}
            <div>
              <label htmlFor="mothersName" className="block text-sm font-medium text-gray-700 mb-2">
                Mother's Name / माता का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="mothersName"
                {...register('mothersName', { required: "Mother's name is required / माता का नाम आवश्यक है" })}
                error={errors.mothersName?.message}
                placeholder="Enter mother's name / माता का नाम दर्ज करें"
                className={errors.mothersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Father's Domicile */}
            <div>
              <label htmlFor="fathersDomicile" className="block text-sm font-medium text-gray-700 mb-2">
                Father's Domicile / पिता का निवास: <span className="text-red-500">*</span>
              </label>
              <Input
                id="fathersDomicile"
                {...register('fathersDomicile', { required: "Father's domicile is required / पिता का निवास आवश्यक है" })}
                error={errors.fathersDomicile?.message}
                placeholder="Enter father's domicile / पिता का निवास दर्ज करें"
                className={errors.fathersDomicile ? 'border-red-500' : ''}
              />
            </div>

            {/* Father's Profession */}
            <div>
              <label htmlFor="fathersProfession" className="block text-sm font-medium text-gray-700 mb-2">
                His Profession / उनका व्यवसाय: <span className="text-red-500">*</span>
              </label>
              <Input
                id="fathersProfession"
                {...register('fathersProfession', { required: "Father's profession is required / पिता का व्यवसाय आवश्यक है" })}
                error={errors.fathersProfession?.message}
                placeholder="Enter profession / व्यवसाय दर्ज करें"
                className={errors.fathersProfession ? 'border-red-500' : ''}
              />
            </div>

            {/* Godfather's Name */}
            <div>
              <label htmlFor="godfathersName" className="block text-sm font-medium text-gray-700 mb-2">
                Godfather's Name / गॉडफादर का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="godfathersName"
                {...register('godfathersName', { required: "Godfather's name is required / गॉडफादर का नाम आवश्यक है" })}
                error={errors.godfathersName?.message}
                placeholder="Enter godfather's name / गॉडफादर का नाम दर्ज करें"
                className={errors.godfathersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Godmother's Name */}
            <div>
              <label htmlFor="godmothersName" className="block text-sm font-medium text-gray-700 mb-2">
                Godmother's Name / गॉडमदर का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="godmothersName"
                {...register('godmothersName', { required: "Godmother's name is required / गॉडमदर का नाम आवश्यक है" })}
                error={errors.godmothersName?.message}
                placeholder="Enter godmother's name / गॉडमदर का नाम दर्ज करें"
                className={errors.godmothersName ? 'border-red-500' : ''}
              />
            </div>

            {/* Minister's Name */}
            <div className="md:col-span-2">
              <label htmlFor="ministersName" className="block text-sm font-medium text-gray-700 mb-2">
                Minister's Name / मंत्री का नाम: <span className="text-red-500">*</span>
              </label>
              <Input
                id="ministersName"
                {...register('ministersName', { required: "Minister's name is required / मंत्री का नाम आवश्यक है" })}
                error={errors.ministersName?.message}
                placeholder="Enter minister's name / मंत्री का नाम दर्ज करें"
                className={errors.ministersName ? 'border-red-500' : ''}
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

export default BaptismCertificate

