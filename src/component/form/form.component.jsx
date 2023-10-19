import React, { useState, useEffect } from "react";
import {
  Container,
  Col,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Row,
} from "react-bootstrap";
import styled from "styled-components";
import logo from "../../asset/images/UniversityPicture.png";
import faregh from "../../asset/images/faregh.jpg";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const StyledFormControl = styled(FormControl)`
  &::placeholder {
    color: black;
    opacity: 0.3;
    font-size: 14px;
    font-family: shabnam;
  }
`;

function FormInput() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    nationalId: "",
    subject: "",
    grade: "",
    job: "",
    office: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${formData.nationalId}`
        );
        if (response.ok) {
          const data = await response.json();

          setFormData({
            ...formData,
            name: data.name,
            lastName: data.lastName,
          });
        } else {
          setErrors({ ...errors, nationalId: "کد ملی یافت نشد" });
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (/^\d{10}$/.test(formData.nationalId)) {
      fetchData();
    }
  }, [formData.nationalId]);
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name",
      "lastName",
      "nationalId",
      "subject",
      "grade",
      "job",
      "office",
      "phoneNumber",
      "email",
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        newErrors[field] = "لطفاً فرم عضویت را کامل کنید";
      }
    }

    if (formData.nationalId && !/^\d{10}$/.test(formData.nationalId)) {
      newErrors.nationalId = "کد ملی باید ۱۰ رقمی باشد";
    }

    if (formData.phoneNumber && !/^\d{11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "شماره تماس باید ۱۱ رقمی باشد";
    }

    // Check for email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "فرمت ایمیل معتبر نیست";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (isValid) {
      try {
        // Show confirmation dialog
        const confirmResult = await Swal.fire({
          title: "آیا اطلاعات را تایید می‌کنید؟",
          text: "پس از تایید، اطلاعات شما ثبت خواهد شد.",
          icon: "question",
          showCancelButton: false,
          confirmButtonText: "تایید",
          cancelButtonText: "انصراف",
          customClass: {
            popup: "custom-sweetalert-font",
            confirmButton: "custom-primary-button",
            cancelButton: "custom-secondary-button",
          },
        });

        // If the user confirms, proceed with form submission
        if (confirmResult.isConfirmed) {
          // Make a POST request to your API endpoint with formData
          const response = await fetch("API_ENDPOINT", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          if (response.ok) {
            Swal.fire({
              title: " دانشگاه علوم و فنون بابل",
              text: "اطلاعات شما با موفقیت ثبت شد.",
              icon: "success",
              confirmButtonText: "ادامه",
              customClass: {
                popup: "custom-sweetalert-font",
              },
            });
            // Optionally, you can reset the form fields here
            setFormData({
              name: "",
              lastName: "",
              nationalId: "",
              subject: "",
              grade: "",
              job: "",
              office: "",
              phoneNumber: "",
              email: "",
            });
          } else {
            // Handle the error response from the API
            Swal.fire({
              title: "خطا",
              text: "در ارسال اطلاعات به سرور مشکلی پیش آمده است.",
              icon: "error",
              confirmButtonText: "ادامه",
              customClass: {
                popup: "custom-sweetalert-font",
              },
            });
          }
        }
      } catch (error) {
        console.error("Error sending data: ", error);
      }
    }
  };

  return (
    <Container className="form-container">
      <div className="row">
        <div className="col-2 col-md-2 text-center">
          <img className="logo mb-5" src={logo} alt="Logo" />
        </div>
        <div className="col-6 col-md-8 text-center">
          <h1 className="form-title   ">
            عضویت در انجمن فارغ التحصیلان دانشگاه علوم و فنون
          </h1>
        </div>
        <div className="col-2 col-md-2 text-center">
          <img src={faregh} className="faregh-logo mt-3" alt="Faregh Logo" />
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={4}>
            <FormGroup>
              <FormLabel>کد ملی :</FormLabel>
              <StyledFormControl
                type="number"
                name="nationalId"
                id="nationalId"
                value={formData.nationalId}
                onChange={handleChange}
                placeholder="459****20"
              />
              {errors.nationalId && (
                <div className="text-danger">{errors.nationalId}</div>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <FormLabel>نام :</FormLabel>
              <StyledFormControl
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="احمد"
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <FormLabel>نام خانوادگی :</FormLabel>
              <StyledFormControl
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="احمدی"
              />
              {errors.lastName && (
                <div className="text-danger">{errors.lastName}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={4} className="mt-2">
            <FormGroup>
              <FormLabel>شماره تماس:</FormLabel>
              <StyledFormControl
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="5673****09"
              />
              {errors.phoneNumber && (
                <div className="text-danger">{errors.phoneNumber}</div>
              )}
            </FormGroup>
          </Col>
          <Col md={8} className="mt-2">
            <FormGroup>
              <FormLabel> ایمیل:</FormLabel>
              <StyledFormControl
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ahmadahamdi@gmail.com"
              />
              {errors.email && (
                <div className="text-danger">{errors.email}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={6} className="mt-2">
            <FormGroup>
              <FormLabel>
                رشته و مقطعی که در علوم و فنون دانشجو بودید :
              </FormLabel>
              <StyledFormControl
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="مهندسی کامپیوتر -کارشناسی پیوسته"
              />
              {errors.subject && (
                <div className="text-danger">{errors.subject}</div>
              )}
            </FormGroup>
          </Col>
          <Col md={6} className="mt-2">
            <FormGroup>
              <FormLabel>
                مقطع اخرین مدرک تحصیلی و نام دانشگاه محل اخذ:
              </FormLabel>
              <StyledFormControl
                type="text"
                name="grade"
                id="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="کارشناسی-دانشگاه علوم و فنون"
              />
              {errors.grade && (
                <div className="text-danger">{errors.grade}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mt-2">
            <FormGroup>
              <FormLabel> شغل :</FormLabel>
              <StyledFormControl
                type="text"
                name="job"
                id="job"
                value={formData.job}
                onChange={handleChange}
                placeholder="مهندس کامپیوتر"
              />
              {errors.job && <div className="text-danger">{errors.job}</div>}
            </FormGroup>
          </Col>
          <Col md={6} className="mt-2">
            <FormGroup>
              <FormLabel>محل کار :</FormLabel>
              <StyledFormControl
                type="text"
                name="office"
                id="office"
                value={formData.office}
                onChange={handleChange}
                placeholder="شرکت ***"
              />
              {errors.office && (
                <div className="text-danger">{errors.office}</div>
              )}
            </FormGroup>
          </Col>
        </Row>
        <div className="d-flex justify-content-center">
          <Link
            to="/form-table"
            className="btn-submit btn btn-primary mt-4 mb-3  py-2 "
            onClick={handleSubmit}
          >
            تایید
          </Link>
        </div>
      </Form>
    </Container>
  );
}
export default FormInput;
