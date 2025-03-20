export const summarizeDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/v1/summarize_doc', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        errorData.detail || 'Unknown error'
      }`,
    );
  }

  const res = await response.json().then((e) => e.summary);
  console.log(res);

  return res;
};

export const compareDocuments = async (files: FileList) => {
  if (files.length !== 2) {
    throw new Error('Please select two files to compare.');
  }

  const formData = new FormData();
  formData.append('file_v1', files[0]);
  formData.append('file_v2', files[1]);

  const response = await fetch('http://localhost:8000/api/v1/compare_docs', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        errorData.detail || 'Unknown error'
      }`,
    );
  }

  const res = response.json().then((e) => e.comparison);
  return res;
};

export const imageToText = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://localhost:8000/api/v1/gradio_chat', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${
        errorData.detail || 'Unknown error'
      }`,
    );
  }

  return response.json();
};
