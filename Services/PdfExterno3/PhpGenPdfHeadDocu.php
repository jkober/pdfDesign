<?php
namespace Design\DesignBundle\Services\PdfExterno3;
class PhpGenPdfHeadDocu  extends PhpGenPdfSections {
    //--------------------------------------------------------------------------
    function __construct( $head) {
        //----------------------------------------------------------------------
        $this->pdfSec = $head;
        $this->initialize();
        //----------------------------------------------------------------------
    }
    public function write(PhpGenPdf $phpGen) {
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
        $this->setHeightHead();
        $this->_write($phpGen,false,true);
        $phpGen->getPdf()->setDocumentHead();
        //----------------------------------------------------------------------
        //----------------------------------------------------------------------
    }
}
?>