const profileImageInput = document.getElementById('profileImage');
const preview = document.getElementById('preview');
const placeholder = document.getElementById('placeholder');

profileImageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
      placeholder.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

function saveProfile() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const address = document.getElementById('address').value;

  alert("Profile Saved!\n\n" + `Name: ${name}\nEmail: ${email}\nAddress: ${address}`);
}
