import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface BackgroundSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBackground: (background: string) => void;
  currentBackground?: string;
}

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #f8ceec 0%, #a88beb 100%)',
];

const solidColors = [
  '#ffffff',
  '#f3f4f6',
  '#e5e7eb',
  '#dbeafe',
  '#fef3c7',
  '#fee2e2',
  '#fce7f3',
  '#e0e7ff',
  '#d1fae5',
  '#cffafe',
];

export function BackgroundSelector({
  open,
  onOpenChange,
  onSelectBackground,
  currentBackground = '#ffffff',
}: BackgroundSelectorProps) {
  const [selectedBg, setSelectedBg] = useState(currentBackground);
  const [customColor, setCustomColor] = useState('#ffffff');

  const handleSave = () => {
    onSelectBackground(selectedBg);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Изменить фон папки</DialogTitle>
          <DialogDescription>
            Выберите цвет или градиент для фона этой папки
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="gradients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gradients">Градиенты</TabsTrigger>
            <TabsTrigger value="colors">Цвета</TabsTrigger>
            <TabsTrigger value="custom">Свой цвет</TabsTrigger>
          </TabsList>

          <TabsContent value="gradients" className="space-y-4">
            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
              {gradients.map((gradient, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBg(gradient)}
                  className={`h-20 rounded-lg border-2 transition-all ${
                    selectedBg === gradient
                      ? 'border-blue-500 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: gradient }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-5 gap-3 p-1">
              {solidColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBg(color)}
                  className={`h-16 rounded-lg border-2 transition-all ${
                    selectedBg === color
                      ? 'border-blue-500 scale-105'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="custom-color">Выберите цвет</Label>
                <div className="flex gap-3">
                  <input
                    id="custom-color"
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setSelectedBg(e.target.value);
                    }}
                    className="h-12 w-20 rounded cursor-pointer"
                  />
                  <div className="flex-1 flex items-center">
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded">
                      {customColor}
                    </code>
                  </div>
                </div>
              </div>
              <div
                className="h-32 rounded-lg border-2"
                style={{ backgroundColor: customColor }}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview */}
        <div className="space-y-2">
          <Label>Предпросмотр</Label>
          <div
            className="h-24 rounded-lg border-2 border-gray-200 flex items-center justify-center"
            style={{ background: selectedBg }}
          >
            <span className="text-sm font-medium text-gray-700 bg-white/80 px-3 py-1 rounded">
              Так будет выглядеть фон папки
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleSave}>Сохранить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
