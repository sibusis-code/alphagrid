// Form Handling - Validation and Submission

// Form validation rules
const validationRules = {
  required: (value) => value.trim() !== '',
  email: (value) => isValidEmail(value),
  phone: (value) => isValidPhone(value),
  minLength: (value, length) => value.length >= length,
  maxLength: (value, length) => value.length <= length
};

// Validate single field
function validateField(input) {
  const value = input.value;
  const rules = input.dataset.validate ? input.dataset.validate.split('|') : [];
  const errorElement = input.parentElement.querySelector('.form-error') || createErrorElement(input);
  
  let isValid = true;
  let errorMessage = '';
  
  for (const rule of rules) {
    if (rule === 'required' && !validationRules.required(value)) {
      isValid = false;
      errorMessage = 'This field is required';
      break;
    }
    
    if (rule === 'email' && value && !validationRules.email(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
      break;
    }
    
    if (rule === 'phone' && value && !validationRules.phone(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
      break;
    }
    
    if (rule.startsWith('minLength:')) {
      const length = parseInt(rule.split(':')[1]);
      if (value && !validationRules.minLength(value, length)) {
        isValid = false;
        errorMessage = `Minimum ${length} characters required`;
        break;
      }
    }
  }
  
  if (isValid) {
    input.classList.remove('error');
    errorElement.classList.remove('active');
    errorElement.textContent = '';
  } else {
    input.classList.add('error');
    errorElement.classList.add('active');
    errorElement.textContent = errorMessage;
  }
  
  return isValid;
}

// Create error element if it doesn't exist
function createErrorElement(input) {
  const error = document.createElement('div');
  error.className = 'form-error';
  input.parentElement.appendChild(error);
  return error;
}

// Validate entire form
function validateForm(formElement) {
  const inputs = formElement.querySelectorAll('[data-validate]');
  let isFormValid = true;
  
  inputs.forEach(input => {
    const isValid = validateField(input);
    if (!isValid) {
      isFormValid = false;
    }
  });
  
  return isFormValid;
}

// Submit contact form
async function submitContactForm(formData) {
  // Using FormSpree - replace with your FormSpree endpoint
  // Alternative: Use EmailJS (see commented code below)
  
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // Replace with actual endpoint
  
  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      return { success: true, message: 'Thank you! Your message has been sent successfully.' };
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    return { success: false, message: 'Sorry, there was an error sending your message. Please try again or email us directly at sales@alphagrid.co.za' };
  }
}

// Alternative: EmailJS implementation
/*
async function submitContactForm(formData) {
  // Initialize EmailJS with your public key
  emailjs.init('YOUR_PUBLIC_KEY');
  
  try {
    const response = await emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      formData
    );
    
    if (response.status === 200) {
      return { success: true, message: 'Thank you! Your message has been sent successfully.' };
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    return { success: false, message: 'Sorry, there was an error. Please email us at sales@alphagrid.co.za' };
  }
}
*/

// Initialize contact form
function initContactForm(formId = 'contact-form') {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Add real-time validation
  const inputs = form.querySelectorAll('[data-validate]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(form)) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }
    
    // Get form data
    const formData = {
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      phone: form.querySelector('[name="phone"]').value,
      company: form.querySelector('[name="company"]')?.value || '',
      message: form.querySelector('[name="message"]').value,
      timestamp: new Date().toISOString(),
      subject: `Contact Form Submission from ${form.querySelector('[name="name"]').value}`
    };
    
    // Disable submit button
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Submit form
    const result = await submitContactForm(formData);
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    
    // Show result
    if (result.success) {
      showToast(result.message, 'success', 5000);
      form.reset();
      
      // Remove any error states
      inputs.forEach(input => {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.form-error');
        if (errorElement) {
          errorElement.classList.remove('active');
        }
      });
    } else {
      showToast(result.message, 'error', 7000);
    }
  });
}

// Initialize quote form
function initQuoteForm(formId = 'quote-form') {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Pre-fill product if specified in URL
  const productParam = getQueryParam('product');
  if (productParam) {
    const productSelect = form.querySelector('[name="product"]');
    if (productSelect) {
      // Try to find matching option
      const options = Array.from(productSelect.options);
      const matchingOption = options.find(opt => 
        opt.value.toLowerCase() === productParam.toLowerCase()
      );
      if (matchingOption) {
        productSelect.value = matchingOption.value;
      }
    }
  }
  
  // Populate product dropdown with categories
  const productSelect = form.querySelector('[name="product"]');
  if (productSelect && allProducts.length > 0) {
    // Group products by category
    const categories = getCategories().filter(cat => cat !== 'All');
    
    productSelect.innerHTML = '<option value="">Select a product...</option>';
    
    categories.forEach(category => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = category;
      
      const categoryProducts = getProductsByCategory(category);
      categoryProducts.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        optgroup.appendChild(option);
      });
      
      productSelect.appendChild(optgroup);
    });
  }
  
  // Add real-time validation
  const inputs = form.querySelectorAll('[data-validate]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });
  
  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm(form)) {
      showToast('Please fill in all required fields correctly', 'error');
      return;
    }
    
    // Get form data
    const formData = {
      name: form.querySelector('[name="name"]').value,
      email: form.querySelector('[name="email"]').value,
      phone: form.querySelector('[name="phone"]').value,
      company: form.querySelector('[name="company"]')?.value || '',
      product: form.querySelector('[name="product"]').value,
      quantity: form.querySelector('[name="quantity"]')?.value || 'Not specified',
      projectDetails: form.querySelector('[name="projectDetails"]').value,
      urgency: form.querySelector('[name="urgency"]')?.value || 'Normal',
      timestamp: new Date().toISOString(),
      subject: `Quote Request for ${form.querySelector('[name="product"]').value}`
    };
    
    // Disable submit button
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Submit form
    const result = await submitContactForm(formData);
    
    // Re-enable button
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    
    // Show result
    if (result.success) {
      showToast('Quote request sent successfully! We will contact you soon.', 'success', 5000);
      form.reset();
      
      // Remove any error states
      inputs.forEach(input => {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.form-error');
        if (errorElement) {
          errorElement.classList.remove('active');
        }
      });
    } else {
      showToast(result.message, 'error', 7000);
    }
  });
}

// Initialize forms on page load
document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initQuoteForm();
});
