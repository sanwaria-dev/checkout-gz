import {
  reactExtension,
  Banner,
  BlockStack,
  Button,
  Choice,
  ChoiceList,
  Divider,
  Heading,
  Select,
  Text,
  TextField,
  DateField,
  PhoneField,
  useApplyCartLinesChange,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => <PrescriptionForm />);

function PrescriptionForm() {
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();

  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [editingLine, setEditingLine] = useState(null);
  const [selectedPet, setSelectedPet] = useState("");
  const [selectedVet, setSelectedVet] = useState("");
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("Dog");
  const [breedType, setBreedType] = useState("mixed");
  const [petBreed, setPetBreed] = useState("");
  const [petBirthday, setPetBirthday] = useState("");
  const [petSex, setPetSex] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petMeds, setPetMeds] = useState("");
  const [petAllergies, setPetAllergies] = useState("");
  const [petConditions, setPetConditions] = useState("");
  const [vetClinic, setVetClinic] = useState("");
  const [vetPhone, setVetPhone] = useState("");
  const [dateError, setDateError] = useState(undefined);

  useEffect(() => {
    const allPets = [];
    const allVets = [];
    cartLines.forEach((line) => {
      // Check if the product has a specific tag indicating it belongs to the prescription collection
      const isPrescriptionProduct = line?.merchandise?.product?.tags?.includes("_prescription");
      if (!isPrescriptionProduct) return;

      const pet = {};
      const vet = {};
      line.attributes.forEach((attr) => {
        if (attr.key.startsWith("_pet")) {
          pet[attr.key.slice(4).toLowerCase()] = attr.value;
        } else if (attr.key.startsWith("_vet")) {
          vet[attr.key.slice(4).toLowerCase()] = attr.value;
        }
      });
      if (pet.name) allPets.push(pet);
      if (vet.clinic) allVets.push(vet);
    });
    const uniquePets = allPets.filter((p, index) => allPets.findIndex((pp) => pp.name === p.name) === index);
    const uniqueVets = allVets.filter((v, index) => allVets.findIndex((vv) => vv.clinic === v.clinic) === index);
    setPets(uniquePets);
    setVets(uniqueVets);
    console.log('Cart Lines:', cartLines);
  }, [cartLines]);

  const resetForm = () => {
    setSelectedPet("");
    setSelectedVet("");
    setPetName("");
    setPetType("Dog");
    setBreedType("mixed");
    setPetBreed("");
    setPetBirthday("");
    setPetSex("");
    setPetWeight("");
    setPetMeds("");
    setPetAllergies("");
    setPetConditions("");
    setVetClinic("");
    setVetPhone("");
    setDateError(undefined);
  };

  const startEditing = (line) => {
    resetForm();
    setEditingLine(line);
    const attrs = line.attributes.reduce((acc, attr) => {
      acc[attr.key] = attr.value;
      return acc;
    }, {});
    setPetName(attrs._petName || "");
    setPetType(attrs._petType || "Dog");
    setBreedType(attrs._petBreedType || "mixed");
    setPetBreed(attrs._petBreed || "");
    setPetBirthday(attrs._petBirthday || "");
    setPetSex(attrs._petSex || "");
    setPetWeight(attrs._petWeight || "");
    setPetMeds(attrs._petMeds || "");
    setPetAllergies(attrs._petAllergies || "");
    setPetConditions(attrs._petConditions || "");
    setVetClinic(attrs._vetClinic || "");
    setVetPhone(attrs._vetPhone || "");
    if (attrs._petName && pets.some((p) => p.name === attrs._petName)) {
      setSelectedPet(attrs._petName);
    } else if (attrs._petName) {
      setSelectedPet("add");
    }
    if (attrs._vetClinic && vets.some((v) => v.clinic === attrs._vetClinic)) {
      setSelectedVet(attrs._vetClinic);
    } else if (attrs._vetClinic) {
      setSelectedVet("other");
    }
  };

  const handleSelectPet = (value) => {
    setSelectedPet(value);
    if (value !== "add" && value) {
      const pet = pets.find((p) => p.name === value);
      if (pet) {
        setPetName(pet.name || "");
        setPetType(pet.type || "Dog");
        setBreedType(pet.breedtype || "mixed");
        setPetBreed(pet.breed || "");
        setPetBirthday(pet.birthday || "");
        setPetSex(pet.sex || "");
        setPetWeight(pet.weight || "");
        setPetMeds(pet.meds || "");
        setPetAllergies(pet.allergies || "");
        setPetConditions(pet.conditions || "");
      }
    } else {
      resetPetFields();
    }
  };

  const resetPetFields = () => {
    setPetName("");
    setPetType("Dog");
    setBreedType("mixed");
    setPetBreed("");
    setPetBirthday("");
    setPetSex("");
    setPetWeight("");
    setPetMeds("");
    setPetAllergies("");
    setPetConditions("");
    setDateError(undefined);
  };

  const handleSelectVet = (value) => {
    setSelectedVet(value);
    if (value !== "other" && value) {
      const vet = vets.find((v) => v.clinic === value);
      if (vet) {
        setVetClinic(vet.clinic || "");
        setVetPhone(vet.phone || "");
      } else {
        setVetClinic(value);
        setVetPhone("");
      }
    } else {
      setVetClinic("");
      setVetPhone("");
    }
  };

  const saveChanges = async () => {
    if (!editingLine) return;

    const newAttributes = editingLine.attributes
      .filter((attr) => !attr.key.startsWith("_"))
      .map((attr) => ({ key: attr.key, value: attr.value }));

    newAttributes.push({ key: "_petName", value: petName });
    newAttributes.push({ key: "_petType", value: petType });
    newAttributes.push({ key: "_petBreedType", value: breedType });
    newAttributes.push({ key: "_petBreed", value: petBreed });
    newAttributes.push({ key: "_petBirthday", value: petBirthday });
    newAttributes.push({ key: "_petSex", value: petSex });
    newAttributes.push({ key: "_petWeight", value: petWeight });
    newAttributes.push({ key: "_petMeds", value: petMeds });
    newAttributes.push({ key: "_petAllergies", value: petAllergies });
    newAttributes.push({ key: "_petConditions", value: petConditions });
    newAttributes.push({ key: "_vetClinic", value: vetClinic });
    newAttributes.push({ key: "_vetPhone", value: vetPhone });

    const result = await applyCartLinesChange({
      type: "updateCartLine",
      id: editingLine.id,
      attributes: newAttributes,
    });

    if (result.type === "success") {
      setEditingLine(null);
      resetForm();
    } else {
      console.error(result);
    }
  };

  const getWeightRange = (title) => {
    if (!title) return null;
    const match = title.match(/([\d.]+)-([\d.]+) lbs/i);
    if (match) {
      return { min: parseFloat(match[1]), max: parseFloat(match[2]) };
    }
    return null;
  };

  const isWeightInRange = () => {
    if (!editingLine || !petWeight) return true;
    const range = getWeightRange(editingLine?.merchandise?.product?.title);
    if (!range) return true;
    const weight = parseFloat(petWeight);
    return weight >= range.min && weight <= range.max;
  };

   const prescriptionLines= cartLines;

  const predefinedClinics = [
    {
      value: "Rancho Las Botas",
      label: "Rancho Las Botas \u2013 Septima 2L, Rancho Santa Fe, Tecate",
    },
  ];

  // JSON mapping of pet types to breed options
  const breeds = {
    Dog: [
      { value: "Labrador", label: "Labrador Retriever" },
      { value: "GermanShepherd", label: "German Shepherd" },
      { value: "Bulldog", label: "Bulldog" },
      { value: "Poodle", label: "Poodle" },
      { value: "Beagle", label: "Beagle" },
      { value: "Rottweiler", label: "Rottweiler" },
      { value: "Dachshund", label: "Dachshund" },
      { value: "GoldenRetriever", label: "Golden Retriever" },
      { value: "CockerSpaniel", label: "Cocker Spaniel" },
      { value: "EnglishSetter", label: "English Setter" },
      { value: "Brittany", label: "Brittany" },
      { value: "Greyhound", label: "Greyhound" },
      { value: "Bloodhound", label: "Bloodhound" },
      { value: "BassetHound", label: "Basset Hound" },
      { value: "SiberianHusky", label: "Siberian Husky" },
      { value: "GreatDane", label: "Great Dane" },
      { value: "Boxer", label: "Boxer" },
      { value: "JackRussellTerrier", label: "Jack Russell Terrier" },
      { value: "BullTerrier", label: "Bull Terrier" },
      { value: "AiredaleTerrier", label: "Airedale Terrier" },
      { value: "ScottishTerrier", label: "Scottish Terrier" },
      { value: "WestHighlandWhiteTerrier", label: "West Highland White Terrier" },
      { value: "Chihuahua", label: "Chihuahua" },
      { value: "Pug", label: "Pug" },
      { value: "ShihTzu", label: "Shih Tzu" },
      { value: "Maltese", label: "Maltese" },
      { value: "FrenchBulldog", label: "French Bulldog" },
      { value: "Dalmatian", label: "Dalmatian" },
      { value: "ChowChow", label: "Chow Chow" },
      { value: "BostonTerrier", label: "Boston Terrier" },
      { value: "BorderCollie", label: "Border Collie" },
      { value: "AustralianShepherd", label: "Australian Shepherd" },
      { value: "PembrokeWelshCorgi", label: "Pembroke Welsh Corgi" },
      { value: "ShetlandSheepdog", label: "Shetland Sheepdog" },
      { value: "BelgianMalinois", label: "Belgian Malinois" },
      { value: "ShibaInu", label: "Shiba Inu" },
      { value: "Akita", label: "Akita" },
      { value: "Newfoundland", label: "Newfoundland" },
      { value: "SaintBernard", label: "Saint Bernard" },
      { value: "Xoloitzcuintli", label: "Xoloitzcuintli" },
    ],
    Cat: [
      { value: "Persian", label: "Persian" },
      { value: "MaineCoon", label: "Maine Coon" },
      { value: "Siamese", label: "Siamese" },
      { value: "Bengal", label: "Bengal" },
      { value: "Sphynx", label: "Sphynx" },
      { value: "BritishShorthair", label: "British Shorthair" },
      { value: "Ragdoll", label: "Ragdoll" },
      { value: "RussianBlue", label: "Russian Blue" },
      { value: "Abyssinian", label: "Abyssinian" },
      { value: "Birman", label: "Birman" },
      { value: "OrientalShorthair", label: "Oriental Shorthair" },
      { value: "NorwegianForest", label: "Norwegian Forest Cat" },
      { value: "ScottishFold", label: "Scottish Fold" },
      { value: "DevonRex", label: "Devon Rex" },
      { value: "CornishRex", label: "Cornish Rex" },
      { value: "Manx", label: "Manx" },
      { value: "ExoticShorthair", label: "Exotic Shorthair" },
      { value: "Himalayan", label: "Himalayan" },
      { value: "Savannah", label: "Savannah" },
      { value: "Balinese", label: "Balinese" },
    ],
    Bird: [
      { value: "Parakeet", label: "Parakeet" },
      { value: "Cockatiel", label: "Cockatiel" },
      { value: "Macaw", label: "Macaw" },
      { value: "Canary", label: "Canary" },
      { value: "Finch", label: "Finch" },
      { value: "AfricanGrey", label: "African Grey Parrot" },
      { value: "Lovebird", label: "Lovebird" },
      { value: "Cockatoo", label: "Cockatoo" },
      { value: "AmazonParrot", label: "Amazon Parrot" },
      { value: "Conure", label: "Conure" },
      { value: "Eclectus", label: "Eclectus Parrot" },
      { value: "QuakerParrot", label: "Quaker Parrot" },
      { value: "Pionus", label: "Pionus Parrot" },
      { value: "Budgerigar", label: "Budgerigar" },
      { value: "Lory", label: "Lory" },
    ],
    Fish: [
      { value: "Goldfish", label: "Goldfish" },
      { value: "Betta", label: "Betta" },
      { value: "Guppy", label: "Guppy" },
      { value: "Tetra", label: "Tetra" },
      { value: "Cichlid", label: "Cichlid" },
      { value: "Angelfish", label: "Angelfish" },
      { value: "Koi", label: "Koi" },
      { value: "Discus", label: "Discus" },
      { value: "Molly", label: "Molly" },
      { value: "Platy", label: "Platy" },
      { value: "Swordtail", label: "Swordtail" },
      { value: "Danio", label: "Danio" },
      { value: "Barbs", label: "Barbs" },
      { value: "Plecostomus", label: "Plecostomus" },
      { value: "Rasbora", label: "Rasbora" },
    ],
    Hamster: [
      { value: "Syrian", label: "Syrian" },
      { value: "DwarfCampbell", label: "Dwarf Campbell" },
      { value: "DwarfWinterWhite", label: "Dwarf Winter White" },
      { value: "Chinese", label: "Chinese" },
      { value: "Roborovski", label: "Roborovski" },
    ],
    GuineaPig: [
      { value: "American", label: "American" },
      { value: "Abyssinian", label: "Abyssinian" },
      { value: "Peruvian", label: "Peruvian" },
      { value: "Silkie", label: "Silkie" },
      { value: "Teddy", label: "Teddy" },
      { value: "Texel", label: "Texel" },
      { value: "Coronet", label: "Coronet" },
      { value: "Skinny", label: "Skinny" },
      { value: "Baldwin", label: "Baldwin" },
    ],
    Rabbit: [
      { value: "HollandLop", label: "Holland Lop" },
      { value: "Lionhead", label: "Lionhead" },
      { value: "NetherlandDwarf", label: "Netherland Dwarf" },
      { value: "FlemishGiant", label: "Flemish Giant" },
      { value: "MiniRex", label: "Mini Rex" },
      { value: "Angora", label: "Angora" },
      { value: "Dutch", label: "Dutch" },
      { value: "Himalayan", label: "Himalayan" },
      { value: "MiniLop", label: "Mini Lop" },
      { value: "JerseyWooly", label: "Jersey Wooly" },
    ],
    Ferret: [
      { value: "Albino", label: "Albino" },
      { value: "Sable", label: "Sable" },
      { value: "BlackSable", label: "Black Sable" },
      { value: "Cinnamon", label: "Cinnamon" },
      { value: "Champagne", label: "Champagne" },
      { value: "Chocolate", label: "Chocolate" },
      { value: "Panda", label: "Panda" },
      { value: "Silver", label: "Silver" },
    ],
    Turtle: [
      { value: "RedEaredSlider", label: "Red-Eared Slider" },
      { value: "BoxTurtle", label: "Box Turtle" },
      { value: "PaintedTurtle", label: "Painted Turtle" },
      { value: "SnappingTurtle", label: "Snapping Turtle" },
      { value: "RussianTortoise", label: "Russian Tortoise" },
      { value: "SulcataTortoise", label: "Sulcata Tortoise" },
      { value: "GreekTortoise", label: "Greek Tortoise" },
      { value: "HermannsTortoise", label: "Hermann’s Tortoise" },
    ],
    Lizard: [
      { value: "BeardedDragon", label: "Bearded Dragon" },
      { value: "LeopardGecko", label: "Leopard Gecko" },
      { value: "Iguana", label: "Iguana" },
      { value: "Chameleon", label: "Chameleon" },
      { value: "CrestedGecko", label: "Crested Gecko" },
      { value: "BlueTonguedSkink", label: "Blue-Tongued Skink" },
      { value: "MonitorLizard", label: "Monitor Lizard" },
      { value: "Uromastyx", label: "Uromastyx" },
    ],
    Snake: [
      { value: "BallPython", label: "Ball Python" },
      { value: "CornSnake", label: "Corn Snake" },
      { value: "BoaConstrictor", label: "Boa Constrictor" },
      { value: "KingSnake", label: "King Snake" },
      { value: "MilkSnake", label: "Milk Snake" },
      { value: "GarterSnake", label: "Garter Snake" },
      { value: "ReticulatedPython", label: "Reticulated Python" },
      { value: "HognoseSnake", label: "Hognose Snake" },
    ],
    Frog: [
      { value: "TreeFrog", label: "Tree Frog" },
      { value: "BullFrog", label: "Bullfrog" },
      { value: "DartFrog", label: "Dart Frog" },
      { value: "PacmanFrog", label: "Pacman Frog" },
      { value: "AfricanClawedFrog", label: "African Clawed Frog" },
      { value: "WhiteTreeFrog", label: "White’s Tree Frog" },
      { value: "RedEyedTreeFrog", label: "Red-Eyed Tree Frog" },
    ],
    Horse: [
      { value: "Arabian", label: "Arabian" },
      { value: "Thoroughbred", label: "Thoroughbred" },
      { value: "QuarterHorse", label: "Quarter Horse" },
      { value: "Appaloosa", label: "Appaloosa" },
      { value: "Clydesdale", label: "Clydesdale" },
      { value: "Morgan", label: "Morgan" },
      { value: "Mustang", label: "Mustang" },
      { value: "TennesseeWalker", label: "Tennessee Walker" },
      { value: "ShetlandPony", label: "Shetland Pony" },
      { value: "Friesian", label: "Friesian" },
    ],
    Pig: [
      { value: "MiniPig", label: "Mini Pig" },
      { value: "PotBellied", label: "Pot-Bellied Pig" },
      { value: "Kunekune", label: "Kunekune" },
      { value: "Juliana", label: "Juliana" },
      { value: "OssabawIsland", label: "Ossabaw Island" },
      { value: "AmericanYorkshire", label: "American Yorkshire" },
    ],
    Goat: [
      { value: "Nubian", label: "Nubian" },
      { value: "Boer", label: "Boer" },
      { value: "Pygmy", label: "Pygmy" },
      { value: "Alpine", label: "Alpine" },
      { value: "Saanen", label: "Saanen" },
      { value: "LaMancha", label: "LaMancha" },
      { value: "Toggenburg", label: "Toggenburg" },
      { value: "NigerianDwarf", label: "Nigerian Dwarf" },
    ],
    Chicken: [
      { value: "Leghorn", label: "Leghorn" },
      { value: "RhodeIslandRed", label: "Rhode Island Red" },
      { value: "Silkie", label: "Silkie" },
      { value: "PlymouthRock", label: "Plymouth Rock" },
      { value: "Orpington", label: "Orpington" },
      { value: "Australorp", label: "Australorp" },
      { value: "Wyandotte", label: "Wyandotte" },
      { value: "Sussex", label: "Sussex" },
    ],
    Duck: [
      { value: "Pekin", label: "Pekin" },
      { value: "Muscovy", label: "Muscovy" },
      { value: "Mallard", label: "Mallard" },
      { value: "Rouen", label: "Rouen" },
      { value: "IndianRunner", label: "Indian Runner" },
      { value: "KhakiCampbell", label: "Khaki Campbell" },
      { value: "Cayuga", label: "Cayuga" },
    ],
  };

  if (editingLine) {
    const range = getWeightRange(editingLine?.merchandise?.product?.title);
    return (
      <BlockStack spacing="loose">
        <Heading>Add Required Information for Your Prescription Item</Heading>
        <Text>All fields are required.</Text>

        <Heading level={2}>Add Your Pet's Information</Heading>
        <Select
          label="Select / Add a Pet"
          value={selectedPet}
          onChange={handleSelectPet}
          options={[
            ...pets.map((p) => ({ value: p.name, label: `${p.name} (${p.weight || 'N/A'} lbs)` })),
            { value: "add", label: "Add a Pet" },
          ]}
        />
        {!isWeightInRange() && range && (
          <Banner status="warning">
            Is your pet's weight up to date? This item is for pets that weigh {range.min}-{range.max} lbs and {petName} weighs {petWeight} lbs. To help with the approval process, check your pet's weight or update the item in your cart.
          </Banner>
        )}
        {(selectedPet === "add" || selectedPet) && (
          <BlockStack spacing="tight">
            <TextField label="Pet Name" value={petName} onChange={setPetName} />
            <Select
              label="Type"
              value={petType}
              onChange={setPetType}
              options={[
                { value: "Dog", label: "Dog" },
                { value: "Cat", label: "Cat" },
                { value: "Bird", label: "Bird" },
                { value: "Fish", label: "Fish" },
                { value: "Hamster", label: "Hamster" },
                { value: "GuineaPig", label: "Guinea Pig" },
                { value: "Rabbit", label: "Rabbit" },
                { value: "Ferret", label: "Ferret" },
                { value: "Turtle", label: "Turtle" },
                { value: "Lizard", label: "Lizard" },
                { value: "Snake", label: "Snake" },
                { value: "Frog", label: "Frog" },
                { value: "Horse", label: "Horse" },
                { value: "Pig", label: "Pig" },
                { value: "Goat", label: "Goat" },
                { value: "Chicken", label: "Chicken" },
                { value: "Duck", label: "Duck" },
              ]}
            />
            <ChoiceList
              title="Is your pet a mixed breed or purebred? It's ok if you don't know."
              value={[breedType]}
              onChange={(val) => setBreedType(val[0])}
            >
              <Choice id="mixed">Mixed breed</Choice>
              <Choice id="purebred">Purebred</Choice>
              <Choice id="unknown">I don't know the breed</Choice>
            </ChoiceList>
            {breedType !== "unknown" && petType && (
              <Select
                label="Breed"
                value={petBreed}
                onChange={setPetBreed}
                options={breeds[petType] || []}
              />
            )}

            <DateField
              label="Birthday"
              value={petBirthday}
              onChange={(value) => {
                setPetBirthday(value);
                setDateError(undefined);
              }}
              onInvalid={() => setDateError("Please enter a valid past date")}
              error={dateError}
              disabled={{
                end: new Date().toISOString().split("T")[0],
              }}
              placeholder="Not sure? Use an approximate date."
            />
            <Select
              label="Sex"
              value={petSex}
              onChange={setPetSex}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Unknown", label: "Unknown" },
              ]}
            />
            <TextField label="Weight (lbs)" value={petWeight} onChange={setPetWeight} />
            <TextField label="Current Medications" value={petMeds} onChange={setPetMeds} placeholder="None" />
            <TextField label="Medication Allergies" value={petAllergies} onChange={setPetAllergies} placeholder="None" />
            <TextField label="Pre-Existing Conditions" value={petConditions} onChange={setPetConditions} placeholder="None" />
          </BlockStack>
        )}

        <Heading level={2}>Add Your Vet Clinic's Information</Heading>
        <Select
          label="Select / Add a Vet Clinic (Choose Other if not listed)"
          value={selectedVet}
          onChange={handleSelectVet}
          options={[
            ...vets.map((v) => ({ value: v.clinic, label: v.clinic })),
            ...predefinedClinics,
          ]}
        />
        {(selectedVet === "other" || selectedVet) && (
          <BlockStack spacing="tight">
            {selectedVet === "other" && (
              <TextField
                label="Clinic Name"
                value={vetClinic}
                onChange={setVetClinic}
                placeholder="Enter your vet clinic name"
              />
            )}
            <PhoneField
              label="Phone Number"
              value={vetPhone}
              onChange={setVetPhone}
              autocomplete={{ field: "telephone" }}
              required
              accessibilityDescription="Enter the phone number for the vet clinic to contact for prescription verification."
            />
          </BlockStack>
        )}

        <Heading level={2}>Prescription Approval</Heading>
        <Text>Our team will review the details with your veterinarian to process your prescription.</Text>

        <Button onPress={saveChanges}>Save and Next Item</Button>
        <Button onPress={() => setEditingLine(null)}>Cancel</Button>
      </BlockStack>
    );
  }

  // If no prescription products are in the cart, render nothing
  if (prescriptionLines.length === 0) {
    return null;
  }

  return (
    <BlockStack spacing="loose">
      <Heading>Prescription Authorization</Heading>
      <Text>Please provide your pet and vet information so we can process your prescription items.</Text>
      <Divider />
      {prescriptionLines.map((line) => {
        const attrs = line.attributes.reduce((acc, attr) => {
          acc[attr.key] = attr.value;
          return acc;
        }, {});
        const petDisplay = attrs._petName ? `${attrs._petName} (${attrs._petWeight || 'N/A'} lbs)` : "Not set";
        const vetDisplay = attrs._vetClinic || "Not set";

        return (
          <BlockStack key={line.id} spacing="tight" border="base" padding="base" cornerRadius="base">
            <Heading level={3}>{line?.merchandise?.product?.title || line?.merchandise?.title || 'Unknown Product'}</Heading>
            <Text>Quantity: {line.quantity}</Text>
            <Text>Pet: {petDisplay}</Text>
            <Text>Vet Clinic: {vetDisplay}</Text>
            <Text>Approval Method: AnimalWiz Contacts Vet</Text>
            <Button onPress={() => startEditing(line)}>Edit Details</Button>
          </BlockStack>
        );
      })}
    </BlockStack>
  );
}