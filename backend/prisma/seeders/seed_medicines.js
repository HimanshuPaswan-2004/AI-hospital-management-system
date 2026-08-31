import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding medicines data...');

  const medicinesData = [
    { name: 'Paracetamol 500mg', category: 'Analgesic', stockQuantity: 150, unitPrice: 2.5, description: 'Used for pain relief and fever.' },
    { name: 'Amoxicillin 250mg', category: 'Antibiotic', stockQuantity: 50, unitPrice: 5.0, description: 'Used to treat bacterial infections.' },
    { name: 'Cetirizine 10mg', category: 'Antihistamine', stockQuantity: 120, unitPrice: 1.5, description: 'Used to treat allergy symptoms.' },
    { name: 'Ibuprofen 400mg', category: 'NSAID', stockQuantity: 200, unitPrice: 3.0, description: 'Used to reduce fever and treat pain or inflammation.' },
    { name: 'Omeprazole 20mg', category: 'Antacid', stockQuantity: 8, unitPrice: 8.5, description: 'Used to treat GERD and stomach ulcers. (Low Stock Example)' },
    { name: 'Azithromycin 500mg', category: 'Antibiotic', stockQuantity: 5, unitPrice: 12.0, description: 'Broad-spectrum antibiotic. (Low Stock Example)' },
    { name: 'Vitamin C 500mg', category: 'Supplement', stockQuantity: 300, unitPrice: 4.0, description: 'Dietary supplement for immunity.' },
    { name: 'Metformin 500mg', category: 'Antidiabetic', stockQuantity: 90, unitPrice: 6.0, description: 'Used to treat type 2 diabetes.' },
    { name: 'Atorvastatin 20mg', category: 'Statin', stockQuantity: 75, unitPrice: 10.0, description: 'Used to lower cholesterol.' },
    { name: 'Aspirin 75mg', category: 'Analgesic', stockQuantity: 250, unitPrice: 1.0, description: 'Blood thinner and pain reliever.' }
  ];

  let addedCount = 0;

  for (const med of medicinesData) {
    const existing = await prisma.medicine.findUnique({ where: { name: med.name } });
    if (!existing) {
      await prisma.medicine.create({ data: med });
      addedCount++;
    }
  }

  console.log(`Successfully added ${addedCount} medicines to the inventory!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
