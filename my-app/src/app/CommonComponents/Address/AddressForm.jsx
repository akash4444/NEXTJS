import { useFormik } from "formik";
import { TextField, MenuItem, Button } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import axios from "axios";
import servicePath from "@/config";

const AddressForm = ({ saveAddress = () => {} }) => {
  const router = useRouter();

  const [pinCodeError, setPinCodeError] = useState(false);

  const {
    values,
    touched,
    errors,
    handleBlur,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    handleChange,
    handleSubmit,
    validateForm,
    setTouched,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      mobileNumber: "",
      pinCode: "",
      state: "",
      address: "",
      locality: "",
      city: "",
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      mobileNumber: Yup.string().required("Mobile Number is required"),
      pinCode: Yup.string()
        .matches(/^\d{6}$/, "Pincode must be 6 digits")
        .required("Pin Code is required"),
      //   state: Yup.string().required("State is required"),
      address: Yup.string().required("Address is required"),
      locality: Yup.string().required("Locality/Town is required"),
      //   city: Yup.string().required("City is required"),
    }),
    onSubmit: async (values) => {
      if (pinCodeError) {
        return;
      }

      await saveAddress(values);
    },
  });

  const handleChangeMobileNumber = (event) => {
    const inputValue = event.target.value;
    // Check if the input value contains only digits
    if (/^\d*$/.test(inputValue)) {
      setFieldValue("mobileNumber", inputValue);
    }
  };

  const fetchPicodes = async (pinCode) => {
    try {
      const response = (
        await axios.get(servicePath + `/pinCode/${pinCode.toString()}`)
      )?.data;

      if (response.Status === "Success") {
        const obj = response.PostOffice[0];
        setFieldValue("state", obj.State);
        setFieldValue("city", obj.Taluk);
        setPinCodeError("");
        return true;
      } else {
        setFieldValue("state", "");
        setFieldValue("city", "");
        setPinCodeError("Invalid pin");
        return false;
      }
    } catch {
      setPinCodeError("Invalid pin");
    }
  };

  const handleChangePinCode = async (event) => {
    const inputValue = event.target.value;
    // Check if the input value contains only digits
    if (/^\d*$/.test(inputValue) && inputValue.length < 7) {
      handleChange(event);
      if (inputValue.length > 5) {
        await fetchPicodes(inputValue);
      }
      setTouched({
        pinCode: true,
      });
    }
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            fullWidth
            id="firstName"
            name="firstName"
            size="small"
            label="First Name"
            variant="outlined"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && Boolean(errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />
          <TextField
            fullWidth
            id="lastName"
            name="lastName"
            label="Last Name"
            size="small"
            variant="outlined"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && Boolean(errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />
          <TextField
            fullWidth
            id="mobileNumber"
            name="mobileNumber"
            label="Mobile Number"
            size="small"
            type="tel"
            variant="outlined"
            inputProps={{ maxLength: 10 }}
            value={values.mobileNumber}
            onChange={handleChangeMobileNumber}
            onBlur={handleBlur}
            error={touched.mobileNumber && Boolean(errors.mobileNumber)}
            helperText={touched.mobileNumber && errors.mobileNumber}
          />
          <TextField
            fullWidth
            id="pinCode"
            name="pinCode"
            label="Pin Code"
            size="small"
            type="tel"
            inputProps={{ maxLength: 6 }}
            variant="outlined"
            value={values.pinCode}
            onChange={handleChangePinCode}
            onBlur={handleBlur}
            error={touched.pinCode && Boolean(errors.pinCode || pinCodeError)}
            helperText={touched.pinCode && (errors.pinCode || pinCodeError)}
          />
          <TextField
            fullWidth
            id="state"
            name="state"
            label="State"
            size="small"
            variant="outlined"
            disabled
            value={values.state}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.state && Boolean(errors.state)}
            helperText={touched.state && errors.state}
          />
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Address(House No, Building, Street, Area)"
            size="small"
            variant="outlined"
            value={values.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.address && Boolean(errors.address)}
            helperText={touched.address && errors.address}
          />
          <TextField
            fullWidth
            id="locality"
            name="locality"
            label="Locality/Town"
            size="small"
            variant="outlined"
            value={values.locality}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.locality && Boolean(errors.locality)}
            helperText={touched.locality && errors.locality}
          />
          <TextField
            fullWidth
            id="city"
            name="city"
            label="City"
            disabled
            size="small"
            variant="outlined"
            value={values.city}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.city && Boolean(errors.city)}
            helperText={touched.city && errors.city}
          />
        </div>
        <div className="mt-4">
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
